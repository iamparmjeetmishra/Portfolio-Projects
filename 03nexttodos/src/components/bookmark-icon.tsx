import { RiPriceTagFill } from "@remixicon/react";

import { cn } from "@/lib/utils";

type BookmarkIconProps = {
  className?: string;
  text: string;
};

export default function BookmarkIcon({ className, text }: BookmarkIconProps) {
  return (
    <span className="flex items-center gap-2 text-base text-zinc-700">
      <RiPriceTagFill className={cn("size-4 rotate-90", className)} />
      <p>{text}</p>
    </span>
  );
}
