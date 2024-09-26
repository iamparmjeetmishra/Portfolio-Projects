"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { toast } from "sonner";

import TabSwitcher from "@/components/tab-switcher";
import { isUserAuthenticated } from "@/lib/server-utils";
import { useUserStore } from "@/store/user-store";

import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";

export default function Authenticte() {
  const router = useRouter();
  // Protected Page

  const checkAuthenticated = useUserStore((state) => state.checkAuthenticated);
  const isAuthenticated = isUserAuthenticated();

  console.log("isAuthfromauthpage", isAuthenticated);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        // const authenticated = checkAuthenticated();
        router.push("/dashboard");
        toast.error("Already authenticated, redirecting to dashboard");
      }
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    toast.error("Please login or signup");
  }

  return (
    <div className="bg-background relative flex h-screen w-full items-center justify-center">
      <TabSwitcher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
    </div>
  );
}
