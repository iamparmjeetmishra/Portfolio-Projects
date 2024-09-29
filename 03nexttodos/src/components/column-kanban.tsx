"use client";

import { Todo } from "@prisma/client";

import { useTodoStore } from "@/store/store";

import NewTodoDialog from "./new-todo-dialog";
import TodoComponent from "./todo";

export default function ColumnKanban({
  title,
  status,
  nums,
  sortedAndFilteredTodos,
}: {
  title: string;
  nums: number | 0;
  status: "ToDo" | "InProgress" | "Completed";
  sortedAndFilteredTodos: Todo[];
}) {
  console.log("sortedAndFilteredTodos", sortedAndFilteredTodos);

  const updateTodo = useTodoStore((state) => state.updateTodo);
  const dragTodo = useTodoStore((state) => state.dragTodo);
  const draggedTodo = useTodoStore((state) => state.draggedTodo);

  // const { updateTodo, dragTodo, draggedTodo } = useTodos();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedTodo) return;
    const newStatus = status;

    await updateTodo(draggedTodo, { status: newStatus });
    dragTodo(null);
  };

  return (
    <section className="w-full flex-1 rounded-xl bg-stone-100 px-3 py-4 md:min-h-60">
      <h2 className="font-medium">
        {title}
        <span className="ml-2 text-base opacity-40">{nums}</span>
      </h2>
      <div
        className="mt-3.5"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex w-[100%] flex-col space-y-4">
          {sortedAndFilteredTodos.map((todo) => (
            <TodoComponent key={todo.id} {...todo} />
          ))}

          {sortedAndFilteredTodos.length === 0 && status === "ToDo" && (
            <div className="mt-8 w-full text-center text-sm text-gray-800">
              <p className="">Create a new task</p>
            </div>
          )}

          {sortedAndFilteredTodos.length === 0 && status !== "ToDo" ? (
            <div className="mt-8 w-full text-center text-sm text-gray-800">
              <p className="mb-4">Drag your tasks here</p>
              <NewTodoDialog actionType="add" />
            </div>
          ) : (
            <NewTodoDialog actionType="add">Add Todo</NewTodoDialog>
          )}
        </div>
      </div>
    </section>
  );
}
