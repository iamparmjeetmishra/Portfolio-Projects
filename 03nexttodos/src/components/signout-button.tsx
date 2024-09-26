"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  async function logOut() {
    await logOutAction();
    toast.success("Sign out");
  }

  return <Button onClick={logOut}>Logout</Button>;
}
