import { z } from "zod";

// i need this todoschema to look like prisma schema
export const Todo = z.object({
  id: z.string().optional(),
  title: z.string().trim(),
  description: z.string().trim().optional(),
  status: z.enum(["ToDo", "InProgress", "Completed"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val)) // transform string to date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
  userId: z.string(),
});

export const TodoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .max(50, { message: "Please title must be under 50 words" }),
  description: z.string().trim().optional(),
  status: z.enum(["ToDo", "InProgress", "Completed"]).default("ToDo"),
  priority: z.enum(["Low", "Medium", "High"]).default("Low"),
  dueDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val)) // transform string to date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
});

export const UpdateTodoData = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: z.enum(["ToDo", "InProgress", "Completed"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  dueDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val)) // transform string to date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be atleast 8 characters long",
  }),
});

export const SignUpFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be atleast 8 characters long",
  }),
});

export type SignInFormInferSchema = z.infer<typeof SignInFormSchema>;
export type SignUpFormInferSchema = z.infer<typeof SignUpFormSchema>;

// ------------todo ----------

// -------------- user---------------

export const UserTypeSchema = z.object({
  name: z.string().trim(),
  email: z.string().email(),
  password: z.string(),
  todos: z.array(TodoFormSchema).optional(),
});

export type UserTypeInferSchema = z.infer<typeof UserTypeSchema>;
