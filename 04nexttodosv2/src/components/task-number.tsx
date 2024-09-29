import { cn } from "@/lib/utils";

type TaskNumberProps = {
  num: number;
  className?: string;
};

export default function TaskNumber({ num, className }: TaskNumberProps) {
  return (
    <small
      className={cn(
        "flex size-5 items-center justify-center rounded-full bg-gray-300",
        className,
      )}
    >
      {num}
    </small>
  );
}
