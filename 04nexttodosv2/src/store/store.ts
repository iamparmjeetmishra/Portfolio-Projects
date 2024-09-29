import { Todo } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "@/lib/axios";
import { isUserAuthenticated } from "@/lib/server-utils";
import { TodoFormSchema } from "@/lib/validations";

export type State = {
  isLoading: boolean;
  todos: Todo[];
  draggedTodo: string | null;
  selectedTodo: Todo | undefined;
  selectedTodoId: Todo["id"] | null;
  fetchTodos: () => Promise<void>;
  createTodo: (todo: typeof TodoFormSchema) => Promise<void>;
  dragTodo: (id: string | null) => void;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updatedFields: Partial<Todo>) => Promise<void>;
  setSelectedTodo: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  // derived state
  numsOfTodo: () => void;
  numsOfInProgress: () => void;
  numsOfCompleted: () => void;
  numsOfHighPriority: () => void;
  numsOfMediumPriority: () => void;
  numsOfLowPriority: () => void;
};

export const useTodoStore = create<State>()(
  persist(
    (set, get) => {
      let hasFetched = false;

      const fetchTodos = async () => {
        set({ isLoading: true });
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
          set({ isLoading: false });
        }
      };
      (async () => {
        if (!hasFetched) {
          await fetchTodos();
          hasFetched = true;
        }
      })();

      return {
        todos: [],
        isLoading: false,
        draggedTodo: null,
        selectedTodo: undefined,
        selectedTodoId: null,
        fetchTodos,
        numsOfTodo: () => {
          const count = get().todos.filter(
            (todo) => todo.status === "ToDo",
          ).length;

          return count;
        },
        numsOfInProgress: () => {
          const count = get().todos.filter(
            (todo) => todo.status === "InProgress",
          ).length;

          return count;
        },
        numsOfCompleted: () => {
          const count = get().todos.filter(
            (todo) => todo.status === "Completed",
          ).length;
          return count;
        },
        numsOfHighPriority: () => {
          const count = get().todos.filter(
            (todo) => todo.priority === "High",
          ).length;

          return count;
        },
        numsOfMediumPriority: () => {
          const count = get().todos.filter(
            (todo) => todo.priority === "Medium",
          ).length;

          return count;
        },
        numsOfLowPriority: () => {
          const count = get().todos.filter(
            (todo) => todo.priority === "Low",
          ).length;
          return count;
        },

        setIsLoading: (isLoading: boolean) => set({ isLoading }),

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

        updateTodo: async (id: Todo["id"], updatedFields: Partial<Todo>) => {
          const token = await isUserAuthenticated();
          if (!token) {
            console.log("No token");
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
            set((state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, ...updatedFields } : todo,
              ),
            }));
          } catch (error) {
            console.log("Error updating task", error);
          }
        },

        setSelectedTodo: (id: string) => {
          const selectedTodo = get().todos.find((todo) => todo.id === id);
          set({ selectedTodo });
        },
      };
    },
    {
      name: "todos-store",
      skipHydration: true,
    },
  ),
);
