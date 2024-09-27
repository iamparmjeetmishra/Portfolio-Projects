// "use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "@prisma/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BtnActions } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  TodoFormInferSchema,
  TodoFormSchema,
  UpdateTodoData,
  UpdateTodoInferSchema,
} from "@/lib/validations";
import { useTodoStore } from "@/store/store";

import TodoFormBtn from "./todo-form-button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import UserBatch from "./user-batch";

type FormProps = {
  id?: Todo["id"];
  actionType: BtnActions;
  onFormSubmission: () => void;
};

export default function FormComponent({
  actionType,
  id,
  onFormSubmission,
}: FormProps) {
  const createTodo = useTodoStore((state) => state.createTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const selectedTodo = useTodoStore((state) => state.selectedTodo);

  const form = useForm<TodoFormInferSchema>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues:
      actionType === "edit" && selectedTodo
        ? {
            title: selectedTodo.title,
            description: selectedTodo.description,
            status: selectedTodo.status,
            priority: selectedTodo.priority,
            dueDate: selectedTodo.dueDate || undefined,
          }
        : {
            title: "",
            description: "",
            status: "ToDo", // Default to a valid status
            priority: "Low", // Default to a valid priority
            dueDate: undefined,
          },
  });

  const handleFormSubmit = async (
    values: TodoFormInferSchema | UpdateTodoInferSchema,
  ) => {
    onFormSubmission();
    try {
      if (actionType === "add") {
        await createTodo(values as typeof TodoFormSchema);
      } else if (actionType === "edit") {
        await updateTodo(selectedTodo!.id, values as typeof UpdateTodoData);
      }
    } catch (error) {
      console.log("Error creating todo", error);
      console.log(error);
      toast.error(`${error}`);
    }
  };
  return (
    <Form {...form}>
      <form
        id="todo-form"
        className="grid gap-4 py-4"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-10">
            <Label className="min-w-20 text-slate-500" htmlFor="due-date">
              Due Date
            </Label>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-10">
            <Label className="min-w-20 text-slate-500" htmlFor="status">
              Status
            </Label>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status of todo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ToDo">To do</SelectItem>
                      <SelectItem value="InProgress">In progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-10">
            <Label className="min-w-20 text-slate-500" htmlFor="priority">
              Priority
            </Label>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority of todo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-10">
            <Label className="min-w-20 text-slate-500" htmlFor="created-by">
              Created by
            </Label>
            <UserBatch size />
          </div>
        </div>
        <Separator className="bg-slate-100" />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Todo title..."
                  className="w-full bg-zinc-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description..."
                  value={field.value ?? ""}
                  className="bg-zinc-200"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TodoFormBtn actionType={actionType} />
      </form>
    </Form>
  );
}
