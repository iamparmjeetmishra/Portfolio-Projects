"use client";

import { revalidatePath } from "next/cache";
import {
  createContext,
  useContext,
  useEffect,
  useOptimistic,
  useState,
} from "react";

import { Todo } from "@prisma/client";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";
import { isUserAuthenticated } from "@/lib/server-utils";
import { PartialTodoSchema } from "@/lib/types";
import { TodoFormSchema } from "@/lib/validations";

type OptimisticTodos = {
  optimisticTodos: Todo[];
  setOptimisticTodos: (action: { type: string; payload: Todo }) => void;
  fetchTodos: () => Promise<void>;
  createTodo: (todo: typeof TodoFormSchema) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updatedFields: Partial<Todo>) => Promise<void>;
  dragTodo: (id: string | null) => void;
  draggedTodo: string | null;
};

export const TodosContext = createContext<OptimisticTodos | undefined>(
  undefined,
);

type TodosProviderProps = {
  children: React.ReactNode;
};

export default function TodosContextProvider({ children }: TodosProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);

  const [optimisticTodos, setOptimisticTodos] = useOptimistic<
    Todo[],
    { type: string; payload: Todo }
  >(todos, (state, { type, payload }) => {
    switch (type) {
      case "add":
        return [...state, payload];
      case "remove":
        return state.filter((todo) => todo.id !== payload.id);
      case "edit":
        return state.map((todo) =>
          todo.id === payload.id ? { ...todo, ...payload } : todo,
        );
      default:
        return state;
    }
  });

  const fetchTodos = async () => {
    try {
      const token = await isUserAuthenticated();
      if (!token) return;

      const res = await axiosInstance.get(`/api/todos`, {
        headers: { Authorization: token },
      });
      setOptimisticTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (newTodo: PartialTodoSchema) => {
    const todoWithId = { ...newTodo, id: crypto.randomUUID() } as Todo; // Ensure newTodo has an id
    setOptimisticTodos({ type: "add", payload: todoWithId });

    try {
      await axiosInstance.post(`/api/createTodo`, newTodo);
    } catch (error) {
      toast.warning("Failed to create todo");
      setOptimisticTodos({ type: "remove", payload: todoWithId }); // Rollback optimistic update
    }
  };

  const removeTodo = async (id: string) => {
    setOptimisticTodos({ type: "remove", payload: { id } as Todo });
    const token = await isUserAuthenticated();
    if (!token) {
      console.log("No token");
      toast.error("No token");
      return;
    }
    try {
      const res = await axiosInstance.delete(`/api/todos/${id}`, {
        headers: { Authorization: token },
      });
      console.log("Delete Response", res);
      toast("Deleted todo");
      revalidatePath("/app", "layout");
    } catch (error) {
      toast.warning("Failed to remove todo");
      setOptimisticTodos({ type: "add", payload: { id } as Todo }); // Rollback optimistic update
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    setOptimisticTodos({
      type: "edit",
      payload: { id, ...updatedFields } as Todo,
    });

    try {
      await axiosInstance.put(`/api/todos/${id}`, updatedFields);
    } catch (error) {
      toast.warning("Failed to update todo");
      setOptimisticTodos({
        type: "edit",
        payload: { id, ...todos.find((todo) => todo.id === id) } as Todo,
      }); // Rollback optimistic update
    }
  };

  const dragTodo = (id: string | null) => {
    setDraggedTodo(id);
  };

  return (
    <TodosContext.Provider
      value={{
        optimisticTodos,
        setOptimisticTodos,
        fetchTodos,
        createTodo,
        removeTodo,
        updateTodo,
        dragTodo,
        draggedTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

// Hook for using TodosContext
export const useTodos = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodosContextProvider");
  }
  return context;
};
