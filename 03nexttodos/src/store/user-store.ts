"use client";

import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "@/lib/axios";
import { isUserAuthenticated } from "@/lib/server-utils";

export type State = {
  isAuthenticated: boolean;
  checkAuthenticated: () => boolean;
  user: User | null;
  createUser: (userValues: Omit<User, "id">) => Promise<void>;
  signIn: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<State>()(
  persist(
    (set) => {
      let hasFetched = false;

      const fetchUser = async () => {
        try {
          const token = await isUserAuthenticated();
          if (!token) {
            console.log("No token");
            return;
          }
          const res = await axiosInstance.get(`/api/user`, {
            headers: {
              Authorization: token,
            },
          });
          set({ user: res.data });
          console.log("Fetched user", res.data);
        } catch (error) {
          console.error("Error fetching user", error);
        }
      };
      (async () => {
        if (!hasFetched) {
          await fetchUser();
          hasFetched = true;
        }
      })();
      return {
        user: null,
        isAuthenticated: false,
        checkAuthenticated: () => {
          let token = isUserAuthenticated();
          const authenticated = !!token;
          set({ isAuthenticated: authenticated });
          return authenticated;
        },
        // ---------------user--------------
        createUser: async (userValues: Omit<User, "id">) => {},
        signIn: async (user: User) => {
          set({ isAuthenticated: true, user });
        },
        logout: async () => {
          localStorage.removeItem("nexttodotoken");
          set({ isAuthenticated: false });
          return;
        },
      };
    },
    { name: "todos-user-store", skipHydration: true },
  ),
);
