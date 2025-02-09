import * as React from "react";

import { useId } from "react";

import { cn } from "@/lib/utils";

const InputContainer = React.forwardRef(
  ({ className, label, children, ...props }, ref) => {
    // Generate a unique ID if not provided
    const generatedId = useId();

    // Clone children and ensure InputLabel gets the input's ID
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === InputLabel) {
        return React.cloneElement(child, { htmlFor: generatedId });
      }
      if (React.isValidElement(child) && child.type === Input) {
        return React.cloneElement(child, { id: generatedId });
      }
      return child;
    });

    return (
      <div
        className={cn("flex flex-col gap-1 w-full", className)}
        ref={ref}
        {...props}
      >
        {enhancedChildren}
      </div>
    );
  }
);
InputContainer.displayName = "InputContainer";

const InputLabel = React.forwardRef(
  ({ className, htmlFor, type, ...props }, ref) => {
    return (
      <label
        htmlFor={htmlFor}
        type={type}
        className={cn("text-sm font-semibold", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputLabel.displayName = "InputLabel";

const InputTextField = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 focus-within:border-lavender-400 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 px-3 py-2",
        className
      )}
    >
      {children}
    </div>
  );
};
InputTextField.displayName = "InputTextField";

const InputIcon = ({ children }) => {
  return <div className="[&_svg]:size-6 [&_svg]:shrink-0 ">{children}</div>;
};
InputIcon.displayName = "InputIcon";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full flex-1 outline-none bg-inherit file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-customNeutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { InputContainer, InputTextField, InputLabel, InputIcon, Input };
