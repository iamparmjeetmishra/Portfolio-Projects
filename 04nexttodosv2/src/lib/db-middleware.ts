import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import ws from "ws";

dotenv.config();

const prismaClientSingleton = () => {
  neonConfig.webSocketConstructor = ws;
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  return prisma;
};

// let prisma: PrismaClient | null;

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export const getPrisma = async () => {
  if (prisma) {
    try {
      await prisma.$connect(); // Pool is handled internally
    } catch (error) {
      console.log("Error connecting to database:", error);
      throw error;
    }
  } else {
    console.log("No prisma instance found");
  }
  return prisma;
};

export const closePrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};
