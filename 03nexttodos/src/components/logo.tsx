import Link from "next/link";

import { RiTodoFill } from "@remixicon/react";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-2">
        <RiTodoFill className="size-8 text-teal-700" />
        <p className="font-semibold text-stone-700">
          nxt<i className="font-bold text-stone-900">Todos</i>
        </p>
      </div>
    </Link>
  );
}
