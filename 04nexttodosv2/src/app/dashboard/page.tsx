"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { toast } from "sonner";

import AppBar from "@/components/appbar";
import Columns from "@/components/columns";
import Sidebar from "@/components/sidebar";
import SortingBar from "@/components/sorting-bar";
import { isUserAuthenticated } from "@/lib/server-utils";

export default function Dashboard() {
  const router = useRouter();
  // Protected Page
  const isAuthenticated = !!isUserAuthenticated();

  // console.log("isAuthenticatedFromDash", isAuthenticated);

  useEffect(() => {
    (async () => {
      // const authenticated = await checkAuthenticated();
      if (isAuthenticated === false) {
        toast.error("Not authenticated");
        router.push("/authenticate");
      }
    })();
  }, [isAuthenticated]);

  // console.log("isAuthenticatedFromDash", isAuthenticated);

  if (isAuthenticated === false) {
    toast.error("Please login or signup");
  }

  return (
    <main className="grid h-screen grid-cols-12 gap-4 p-6">
      <Sidebar className="col-span-2" />
      <div className="col-span-10 space-y-4 rounded-xl bg-white p-6 drop-shadow">
        <AppBar />
        <SortingBar />
        <Columns />
      </div>
    </main>
  );
}
