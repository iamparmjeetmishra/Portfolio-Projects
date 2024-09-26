import { RiAddLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BtnActions } from "@/lib/types";

import FormComponent from "./form";
import { Separator } from "./ui/separator";

type DialogProp = {
  actionType: BtnActions;
};

export default function NewTodoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button
          className="bg-white hover:bg-black hover:text-white"
          variant="secondary"
          size="default"
        >
          <RiAddLine className="mr-2 size-4" />
          <p>Add task</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center font-medium text-slate-500">
            Add a new task
          </DialogTitle>
        </DialogHeader>
        <Separator className="bg-slate-100" />

        <FormComponent />

        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" size="sm" form="todo-form">
              Create Task
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
