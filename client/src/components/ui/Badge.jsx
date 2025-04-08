import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-customNeutral-100 text-customNeutral-700 hover:bg-customNeutral-200",
        secondary:
          "border-transparent bg-faintingLight-300 text-customNeutral-300 hover:bg-faintingLight-400",
        destructive:
          "border-transparent bg-error-100 text-error-400 hover:bg-error-200",
        outline: "text-lavender-400"
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
