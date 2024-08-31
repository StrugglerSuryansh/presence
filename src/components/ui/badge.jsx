import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent text-neutral-50 hover:bg-neutral-900/80",
        secondary:
          "border-transparent  text-neutral-900",
        destructive:
          "border-transparent text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",
        outline: "text-neutral-950 dark:text-neutral-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  bgColor, // New bgColor prop
  ...props
}) {
  // If bgColor is provided, it overrides the variant background color
  const dynamicStyle = bgColor ? { backgroundColor: bgColor } : {};

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={dynamicStyle} // Apply dynamic background color
      {...props}
    />
  );
}

export { Badge, badgeVariants };
