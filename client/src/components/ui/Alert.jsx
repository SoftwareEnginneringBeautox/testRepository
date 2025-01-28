import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "fixed top-10 left-1/2 -translate-x-1/2 min-w-1/6 rounded-lg border border-lavender-400 p-4 [&>svg~*]:pl-9 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:text-foreground z-[999]",
  {
    variants: {
      variant: {
        default: "bg-customNeutral-100  text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const AlertContainer = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
AlertContainer.displayName = "AlertContainer";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

const CloseAlert = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn(
      "absolute top-2 right-2 text-foreground hover:text-lavender-400 transition ml-auto text-xl text-foreground",
      className
    )}
    aria-label="Close Alert"
    {...props}
  >
    &times;
  </button>
));
CloseAlert.displayName = "CloseAlert";

export { AlertContainer, AlertTitle, AlertDescription, CloseAlert };
