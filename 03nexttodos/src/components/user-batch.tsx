import { Avatar } from "@/components/ui/avatar";
import { AvatarWord } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

type UserBatchProps = {
  withPremium?: boolean;
  size?: boolean;
};

export default function UserBatch({ withPremium, size }: UserBatchProps) {
  const user = useUserStore((state) => state.user);
  // console.log("User", user);

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`${size && "size-8"}`}>
        <span className="flex size-10 items-center justify-center bg-zinc-200">
          {AvatarWord(user?.name || "J")}
        </span>
      </Avatar>
      <span className="flex flex-col">
        <p className={`${size && "text-base"} text-sm font-medium leading-6`}>
          {user?.name}
        </p>
        {withPremium && (
          <small className="text-xs text-black/70">Premium account</small>
        )}
      </span>
    </div>
  );
}
