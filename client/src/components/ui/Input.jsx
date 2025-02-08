import * as React from "react";

import { cn } from "@/lib/utils";

const InputContainer = React.forwardRef(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        {label && (
          <label htmlFor={id} className="text-sm font-semibold">
            {label}
          </label>
        )}
        <div className="relative flex items-center">{children}</div>
      </div>
    );
  }
);
InputContainer.displayName = "InputContainer";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex gap-2 h-10 w-full rounded-md focus:border-lavender-400 border-2 border-customNeutral-200 bg-customNeutral-100 px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-customNeutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const InputLabel = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <label
      type={type}
      className={cn("text-sm font-semibold", className)}
      ref={ref}
      {...props}
    />
  );
});
InputLabel.displayName = "InputLabel";

export { InputContainer, Input, InputLabel };
