import Link from "next/link";

import { RiUserLine } from "@remixicon/react";
import { LogOutIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/store";
import { useUserStore } from "@/store/user-store";

import BookmarkIcon from "./bookmark-icon";
import Logo from "./logo";
import TaskNumber from "./task-number";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import UserBatch from "./user-batch";

export default function Sidebar({ className }: { className?: string }) {
  const logout = useUserStore((state) => state.logout);
  const { numsOfHighPriority, numsOfLowPriority, numsOfMediumPriority } =
    useTodoStore();

  const HighPriorityCount = numsOfHighPriority();
  const MediumPriorityCount = numsOfMediumPriority();
  const LowPriorityCount = numsOfLowPriority();

  return (
    <aside className={cn("flex flex-col gap-4", className)}>
      <Logo />
      <UserBatch withPremium />
      <Link
        href={"/dashboard"}
        className="flex items-center gap-2 font-medium text-zinc-700"
      >
        <RiUserLine />
        <p>My Profile</p>
      </Link>
      <Separator className="my-2 bg-black/5" />
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Labels</h2>
        <LabelDiv>
          <BookmarkIcon text="High Priority" className="text-red-500" />
          <TaskNumber num={HighPriorityCount ?? 0} />
        </LabelDiv>
        <LabelDiv>
          <BookmarkIcon text="Medium Priority" className="text-orange-500" />
          <TaskNumber num={MediumPriorityCount ?? 0} />
        </LabelDiv>
        <LabelDiv>
          <BookmarkIcon text="Low Priority" className="text-green-500" />
          <TaskNumber num={LowPriorityCount ?? 0} />
        </LabelDiv>
      </div>
      <Button
        onClick={() => logout()}
        variant="link"
        className="mt-auto w-fit space-x-2 font-medium text-zinc-500"
      >
        <LogOutIcon />
        <p>Log out</p>
      </Button>
    </aside>
  );
}

function LabelDiv({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-base">
      {children}
    </div>
  );
}
