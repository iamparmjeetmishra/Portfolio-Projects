import { Todo } from "@prisma/client";
import { Ellipsis, EllipsisVertical, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToLocaleDate, cn } from "@/lib/utils";
import { useTodoStore } from "@/store/store";

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
  const dragTodo = useTodoStore((state) => state.dragTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

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

          <DropdownMenuContent className="w-1/2">
            <button
              className="w-full cursor-pointer hover:bg-zinc-100"
              onClick={() => removeTodo(id)}
            >
              <DropdownMenuItem className="flex cursor-pointer items-center justify-between gap-2">
                <p>Edit</p>
                <Ellipsis />
              </DropdownMenuItem>
            </button>
            <button
              className="w-full cursor-pointer hover:bg-zinc-100"
              onClick={() => removeTodo(id)}
            >
              <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                <p>Delete</p>
                <Trash />
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <button
        className="absolute right-2 z-20 cursor-pointer"
        onClick={() => removeTask(id)}
      >
        <RiDeleteBinLine />
      </button> */}
    </div>
  );
}
