import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import CloseIcon from "@/assets/icons/CloseIcon";

const alertVariants = cva(
  "fixed flex items-center top-10 left-1/2 -translate-x-1/2 min-w-1/6 rounded-lg border border-lavender-400 p-4 gap-4 z-[999]",
  {
    variants: {
      variant: {
        default: "bg-customNeutral-100 text-foreground",
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
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);
AlertContainer.displayName = "AlertContainer";

const AlertText = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
));
AlertText.displayName = "AlertText";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight text-lg", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-foreground/80", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

const CloseAlert = React.forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={cn(
      "ml-auto text-foreground hover:text-lavender-400 transition text-lg font-semibold",
      className
    )}
    aria-label="Close Alert"
    {...props}
  >
    <CloseIcon size={16} />
  </button>
));
CloseAlert.displayName = "CloseAlert";

export { AlertContainer, AlertText, AlertTitle, AlertDescription, CloseAlert };
