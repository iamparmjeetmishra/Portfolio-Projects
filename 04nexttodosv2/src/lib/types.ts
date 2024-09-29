import { Priority, Status, Todo } from "@prisma/client";

export type StatusEnum = Status;
export type PriorityEnum = Priority;

export type FullTodoSchema = Todo;

export type PartialTodoSchema = Omit<
  Todo,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

export type BtnActions = "edit" | "delete" | "add";
