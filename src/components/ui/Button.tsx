import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "icon";
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-700",
    secondary:
      "border border-stone-200 bg-white text-stone-900 hover:bg-stone-50",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
    icon: "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "icon" && "h-10 w-10 p-0",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
