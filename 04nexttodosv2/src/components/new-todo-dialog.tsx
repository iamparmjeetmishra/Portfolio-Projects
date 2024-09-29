import { useState } from "react";

import { Todo } from "@prisma/client";
import { RiAddLine } from "@remixicon/react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BtnActions } from "@/lib/types";
import { useTodoStore } from "@/store/store";

import FormComponent from "./form";
import { Separator } from "./ui/separator";

type DialogProp = {
  id?: Todo["id"];
  actionType: BtnActions;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function NewTodoDialog({
  id,
  actionType,
  disabled,
  className,
  onClick,
  children,
}: DialogProp) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const setSelectedTodo = useTodoStore((state) => state.setSelectedTodo);

  return (
    <Dialog
      open={isFormOpen}
      onOpenChange={(open) => {
        if (actionType === "edit" && id) {
          setSelectedTodo(id);
        }
        setIsFormOpen(open);
      }}
    >
      <DialogTrigger asChild className="w-full">
        {actionType === "add" ? (
          <Button className={className} variant="outline" size="default">
            <RiAddLine className="mr-2 size-4" />
            <p>{children}</p>
          </Button>
        ) : (
          <Button variant="secondary" className={className} size="default">
            {children}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center font-medium text-slate-500">
            {actionType === "add" ? "Add a new todo" : "Edit Todo"}
          </DialogTitle>
        </DialogHeader>
        <Separator className="bg-slate-100" />

        <FormComponent
          id={id}
          actionType={actionType}
          onFormSubmission={() => {
            flushSync(() => {
              setIsFormOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
