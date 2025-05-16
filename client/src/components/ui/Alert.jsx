import * as React from "react";
import { cva } from "class-variance-authority";
import { createPortal } from "react-dom"; // Add this import
import { cn } from "@/lib/utils";
import CloseIcon from "@/assets/icons/CloseIcon";

const alertVariants = cva(
  "fixed flex items-center top-10 left-1/2 -translate-x-1/2 min-w-1/6 rounded-lg border p-4 gap-4 z-[999]",
  {
    variants: {
      variant: {
        default: "bg-customNeutral-100 text-foreground border-lavender-400",
        error: "bg-error-400 text-white border-error-500 [&>svg]:text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const AlertContainer = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => {
    // Create a portal to render the alert at the document root level
    return createPortal(
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
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
