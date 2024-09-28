import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import { handle } from "hono/vercel";

import { closePrisma, getPrisma } from "@/lib/db-middleware";
import {
  SignInFormSchema,
  SignUpFormSchema,
  TodoFormSchema,
  UpdateTodoData,
} from "@/lib/validations";

type HonoContext = {
  Bindings: {
    JWT_SECRET: string;
  };
};

const app = new Hono<HonoContext>().basePath("/api");

// Middleware
app.use("/api/*", cors());

// app.use("*", (c, next) => {
//   console.log("Iam here hono");
//   console.log("Req Method", c.req.method);
//   return next();
// });

app.get("/health", (c) => {
  return c.json({ message: "ok" });
});

// ------------users------------------

app.post("/register", async (c) => {
  const body = await c.req.json();
  const { success, data, error } = SignUpFormSchema.safeParse(body);
  console.log("NewUser", data);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Failed to create user",
      error,
    });
  }
  const prisma = await getPrisma();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    console.log(user);
    const JwtSecret = process.env.JWT_SECRET as string;

    const jwt = await sign({ id: user.id }, JwtSecret);
    console.log(jwt);

    return c.json({
      user,
      jwt,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return c.json(
          {
            message: "Email already exists.",
          },
          409,
        );
      }
    }
    return c.json(
      {
        message: "Could not create user.",
        error,
      },
      500,
    );
  } finally {
    try {
      await closePrisma();
    } catch (err) {
      console.error("Error closing Prisma connection:", err);
    }
  }
});

app.post("/login", async (c) => {
  const body = await c.req.json();
  const { success, data, error } = SignInFormSchema.safeParse(body);
  console.log("login", data);
  if (!success) {
    return c.json(
      {
        message: "Failed to login user",
        error,
      },
      411,
    );
  }

  // Get user from database
  const prisma = await getPrisma();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    console.log("loginUser", user);

    if (!user) {
      return c.json(
        {
          message: "User not found",
        },
        404,
      );
    }

    // Check if password matches
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return c.json(
        {
          message: "Incorrect password",
        },
        401,
      );
    }
    const JwtSecret = process.env.JWT_SECRET as string;
    if (user && isPasswordCorrect) {
      const jwt = await sign({ id: user.id }, JwtSecret);
      return c.json({
        user,
        jwt,
      });
    }
  } catch (error) {
    console.log(error);
    return c.json({ error: "Error logging in user" }, 401);
  }
});

app.get("/user", async (c) => {
  const token = await c.req.header("Authorization");
  if (!token) {
    return c.json(
      {
        message: "Not authenticated",
      },
      401,
    );
  }
  const JwtSecret = (await process.env.JWT_SECRET) as string;
  const userId = await verify(token, JwtSecret);

  const prisma = await getPrisma();

  try {
    // checking the user exists in the db
    const user = await prisma.user.findUnique({
      where: {
        id: String(userId.id),
      },
    });
    console.log("userExists", user);
    return c.json(user);
  } catch (error) {
    return c.json(
      {
        message: "Failed to fetch user",
        error,
      },
      500,
    );
  } finally {
    await closePrisma();
  }
});
// ----------todos----------------

//Create todo
app.post("/createTodo", async (c) => {
  const body = await c.req.json();
  const token = await c.req.header("Authorization");
  if (!token) {
    return c.json(
      {
        message: "Not authenticated",
      },
      401,
    );
  }

  const JwtSecret = (await process.env.JWT_SECRET) as string;
  // console.log("token", token);

  let userId = await verify(token, JwtSecret);
  // console.log("userId", userId);

  if (!userId) {
    return c.json(
      {
        message: "Invalid token",
      },
      401,
    );
  }

  const prisma = await getPrisma();

  // checking the user exists in the db
  const userExists = await prisma.user.findUnique({
    where: {
      id: String(userId.id),
    },
  });
  // console.log("userExists", userExists);

  if (!userExists) {
    return c.json(
      {
        message: "User not found",
      },
      404,
    );
  }

  try {
    const { success, data, error } = TodoFormSchema.safeParse(body);
    if (!success) {
      return c.json(
        {
          message: "Failed to create todo",
          error,
        },
        411,
      );
    }

    // create todo
    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate ?? ""),
        priority: data.priority,
        status: data.status,
        user: {
          connect: {
            id: String(userId.id),
          },
        },
      },
    });
    return c.json(todo);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Failed to create todo",
        error,
      },
      500,
    );
  } finally {
    await closePrisma();
  }
});

// Fetch todos
app.get("/todos", async (c) => {
  // I want to check if the user is authenticated
  const token = await c.req.header("Authorization");
  if (!token) {
    return c.json(
      {
        message: "Not authenticated",
      },
      401,
    );
  }
  const JwtSecret = (await process.env.JWT_SECRET) as string;
  const userId = await verify(token, JwtSecret);

  const prisma = await getPrisma();

  // checking the user exists in the db
  const userExists = await prisma.user.findUnique({
    where: {
      id: String(userId.id),
    },
  });
  // console.log("userExists", userExists);

  if (!userExists) {
    return c.json(
      {
        message: "User not found",
      },
      404,
    );
  }

  // console.log(userId);

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: String(userId.id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        userId: true,
      },
    });
    console.log("todods", todos);
    return c.json(todos, { status: 200 });
  } catch (error) {
    return c.json(
      {
        message: "Failed to fetch todos",
        error,
      },
      500,
    );
  } finally {
    await closePrisma();
  }
});

// Update todo
app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const token = await c.req.header("Authorization");
  if (!token) {
    return c.json(
      {
        message: "Not authenticated",
      },
      401,
    );
  }
  const JwtSecret = (await process.env.JWT_SECRET) as string;
  const userId = await verify(token, JwtSecret);

  const prisma = await getPrisma();

  // checking the user exists in the db
  const userExists = await prisma.user.findUnique({
    where: {
      id: String(userId.id),
    },
  });
  // console.log("userExists", userExists);

  if (!userExists) {
    return c.json(
      {
        message: "User not found",
      },
      404,
    );
  }
  const updatedFields = await c.req.json();
  const { success, data, error } = UpdateTodoData.safeParse(updatedFields);
  if (!success) {
    return c.json(
      {
        message: "Failed to update status of todo",
        error,
      },
      411,
    );
  }

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { ...updatedFields },
    });
    return c.json(todo);
  } catch (error) {
    return c.json(
      {
        message: "Failed to update todo",
        error,
      },
      500,
    );
  } finally {
    await closePrisma();
  }
});

// Delete todo
app.delete("/todos/:id", async (c) => {
  const id = await c.req.param("id");
  const token = await c.req.header("Authorization");
  if (!token) {
    return c.json(
      {
        message: "Not authenticated",
      },
      401,
    );
  }
  const JwtSecret = (await process.env.JWT_SECRET) as string;
  const userId = await verify(token, JwtSecret);

  const prisma = await getPrisma();

  // checking the user exists in the db
  const userExists = await prisma.user.findUnique({
    where: {
      id: String(userId.id),
    },
  });
  // console.log("userExists", userExists);

  if (!userExists) {
    return c.json(
      {
        message: "User not found",
      },
      404,
    );
  }

  // Here we are going to delete
  try {
    await prisma.todo.delete({ where: { id } });
    return c.json({ message: "Todo deleted successfully" });
  } catch (error) {
    return c.json(
      {
        message: "Failed to remove todo",
        error,
      },
      500,
    );
  } finally {
    await closePrisma();
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
