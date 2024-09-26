import { Todo } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "@/lib/axios";
import { isUserAuthenticated } from "@/lib/server-utils";
import { TodoFormSchema } from "@/lib/validations";

export type State = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  todos: Todo[] | [];
  draggedTodo: string | null;
  selectedTodo: (id: string) => Promise<Todo | void>;
  fetchTodos: () => Promise<void>;
  createTodo: (todo: typeof TodoFormSchema) => Promise<void>;
  dragTodo: (id: string | null) => void;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updatedFields: Partial<Todo>) => Promise<void>;
};

export const useTodoStore = create<State>()(
  persist(
    (set, get) => {
      let hasFetched = false;
      const fetchTodos = async () => {
        set({ isLoading: true }); // Set loading state
        try {
          const token = await isUserAuthenticated();
          if (!token) {
            console.log("No token");
            return;
          }
          const res = await axiosInstance.get(`/api/todos`, {
            headers: {
              Authorization: token,
            },
          });
          set({ todos: res.data });
          console.log("Fetched data", res.data);
        } catch (error) {
          console.error("Error fetching todos", error);
        } finally {
          set({ isLoading: false }); // Reset loading state
        }
      };

      // Immediately invoke fetchTodos when the store is initialized
      (async () => {
        if (!hasFetched) {
          await fetchTodos();
          hasFetched = true;
        }
      })();

      return {
        todos: [],
        draggedTodo: null,
        isLoading: false,
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
        fetchTodos,
        createTodo: async (todo) => {
          const token = await isUserAuthenticated();
          if (!token) {
            console.log("No token");
            return;
          }
          try {
            const res = await axiosInstance.post(`/api/createTodo`, todo, {
              headers: {
                Authorization: `${token}`,
              },
            });
            set((state) => ({
              todos: [...state.todos, res.data],
            }));
          } catch (error) {
            console.log("Error creating todo", error);
          }
        },
        selectedTodo: async (id: string) => {
          const selectedTodo = get().todos.find((todo) => todo.id === id);
          console.log("selectedTodo", selectedTodo);
          return selectedTodo;
        },
        dragTodo: (id) => set({ draggedTodo: id }),
        removeTodo: async (id: string) => {
          const token = await isUserAuthenticated();
          if (!token) {
            console.log("No token");
            return;
          }
          try {
            const res = await axiosInstance.delete(`/api/todos/${id}`, {
              headers: {
                Authorization: `${token}`,
              },
            });
            console.log("Delete Response", res);
            if (res.status === 200) {
              set((state) => ({
                todos: state.todos.filter((todo) => todo.id !== id),
              }));
            }
          } catch (error) {
            console.log("Error removing task", error);
          }
        },
        updateTodo: async (id, updatedFields: Partial<Todo>) => {
          const token = await isUserAuthenticated();
          if (!token) {
            toast.error("No token");
            return;
          }
          try {
            const res = await axiosInstance.put(
              `/api/todos/${id}`,
              updatedFields,
              {
                headers: {
                  Authorization: `${token}`,
                },
              },
            );
            console.log("Todo Update", res);
            set((state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, ...updatedFields } : todo,
              ),
            }));
          } catch (error) {
            console.log("Error updating task", error);
          }
        },
      };
    },
    { name: "todos-store", skipHydration: true },
  ),
);
