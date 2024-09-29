import { RiAddFill, RiSearchLine } from "@remixicon/react";

import NewTodoDialog from "./new-todo-dialog";
import { Input } from "./ui/input";

export default function AppBar({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-semibold">Tasks</h2>
      <div className="flex items-center gap-4">
        <span className="relative">
          <RiSearchLine className="absolute inset-x-1 inset-y-2 size-5 text-gray-300" />
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Task"
            className="rounded py-2 pl-9 pr-3"
          />
        </span>
        <div className="relative flex h-auto items-center space-x-2 rounded bg-black px-4 py-1.5 text-white outline-1 outline-amber-600 hover:bg-black/60 focus:ring-1 focus:ring-emerald-500">
          <RiAddFill />
          <span>Create Todo</span>
          <div className="absolute left-0 right-0 top-0 w-full opacity-0">
            <NewTodoDialog actionType="add" />
          </div>
        </div>
      </div>
    </div>
  );
}
