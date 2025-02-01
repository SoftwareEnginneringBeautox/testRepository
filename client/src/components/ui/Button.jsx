import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center text-center gap-2 whitespace-nowrap rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0 font-semibold",

  //for the default (callToAction) variant
  // p-[0.5rem_1rem] leading-6 rounded-lg gap-2 font-semibold bg-lavender-400 text-customNeutral-100 hover:bg-lavender-500 active:bg-lavender-200 active:text-lavender-500 active:border-lavender-200 flex items-center justify-center text-center

  //for the outline variant
  //border-lavender-400 border-2 text-lavender-400 p-[0.5rem_1rem] leading-6 rounded-lg gap-2 font-semibold hover:bg-lavender-100 hover:border-lavender-100 active:bg-lavender-200 active:text-customNeutral-100 active:border-lavender-200 flex items-center justify-center text-center
  {
    variants: {
      variant: {
        default:
          "bg-lavender-400 text-customNeutral-100 hover:bg-lavender-500 active:bg-lavender-200 active:text-lavender-500 active:border-lavender-200",
        outline:
          "border-2 border-lavender-400 text-lavender-400 hover:bg-lavender-100 hover:border-lavender-100 active:bg-lavender-200 active:text-customNeutral-100 active:border-lavender-200"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
