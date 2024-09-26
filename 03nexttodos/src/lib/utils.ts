import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ToLocaleDate(input: Date) {
  const date = new Date(input);

  // format the date
  const readbleDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return readbleDate;
}

export function AvatarWord(input: string) {
  return input.charAt(0).toUpperCase();
}

export function CapitalizeFirstWord(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function Wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
