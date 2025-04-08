import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--badge-bg)] text-[var(--badge-text)] hover:bg-[var(--badge-bg-hover)]",
        secondary:
          "border-transparent bg-[var(--badge-secondary-bg)] text-[var(--badge-secondary-text)] hover:bg-[var(--badge-secondary-bg-hover)]",
        destructive:
          "border-transparent bg-[var(--badge-destructive-bg)] text-[var(--badge-destructive-text)] hover:bg-[var(--badge-destructive-bg-hover)]",
        outline: "text-[var(--badge-outline-text)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
