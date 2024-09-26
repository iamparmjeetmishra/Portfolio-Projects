import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserBatchProps = {
  withPremium?: boolean;
  size?: boolean;
};

export default function UserBatch({ withPremium, size }: UserBatchProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className={`${size && "size-8"}`}>
        <AvatarImage src="https://github.com/shadcn.png" alt="" />
        <AvatarFallback>d</AvatarFallback>
      </Avatar>
      <span className="flex flex-col">
        <p className={`${size && "text-base"} text-sm font-medium leading-6`}>
          John Wick
        </p>
        {withPremium && (
          <small className="text-xs text-black/70">Premium account</small>
        )}
      </span>
    </div>
  );
}
