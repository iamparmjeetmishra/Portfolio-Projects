import { useTransition } from "react";

import { Todo } from "@prisma/client";
import { Ellipsis, EllipsisVertical, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToLocaleDate, cn } from "@/lib/utils";
import { useTodoStore } from "@/store/store";

import NewTodoDialog from "./new-todo-dialog";
import { Button } from "./ui/button";

type TodoProps = Todo & {
  dueDate: Date | null;
};

export default function TodoComponent({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  createdAt,
}: TodoProps) {
  // const { dragTodo, removeTodo } = useTodos();
  const dragTodo = useTodoStore((state) => state.dragTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "relative flex cursor-move items-start justify-between rounded-lg bg-white px-2 py-4 text-gray-900",
        {
          "border border-sky-500": status === "ToDo",
          "border border-amber-500 shadow": status === "InProgress",
          "border border-emerald-500 shadow": status === "Completed",
        },
      )}
      onDragStart={() => dragTodo(id)}
      draggable
    >
      <div className="w-full space-y-2">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex w-full items-center justify-between gap-2 text-gray-500">
          <small>Priority {priority}</small>
          <small>{dueDate ? ToLocaleDate(dueDate) : ""}</small>
        </div>
      </div>
      <div className="absolute right-2 z-20 cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link">
              <EllipsisVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="flex w-1/2 flex-col gap-1">
            <NewTodoDialog
              className="flex w-full items-center justify-between"
              actionType="edit"
              id={id}
            >
              <p>Update</p>
              <Ellipsis />
            </NewTodoDialog>
            <Button
              disabled={isPending}
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={async () => {
                startTransition(async () => {
                  removeTodo(id);
                });
              }}
            >
              <div className="flex w-full cursor-pointer items-center justify-between px-0">
                <p>Delete</p>
                <Trash />
              </div>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
