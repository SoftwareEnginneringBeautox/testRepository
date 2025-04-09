import * as React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

const InputContainer = React.forwardRef(
  ({ className, label, children, fullWidth, ...props }, ref) => {
    const generatedId = useId();

    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === InputLabel) {
        return React.cloneElement(child, { htmlFor: generatedId });
      }
      if (React.isValidElement(child) && child.type === Input) {
        return React.cloneElement(child, { id: generatedId });
      }
      if (React.isValidElement(child) && child.type === InputArea) {
        return React.cloneElement(child, { id: generatedId });
      }
      return child;
    });

    return (
      <div
        className={cn("flex flex-col gap-1", fullWidth && "w-full", className)}
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
  ({ className, htmlFor, type, fullWidth, ...props }, ref) => {
    return (
      <label
        htmlFor={htmlFor}
        type={type}
        className={cn(
          "text-sm font-semibold",
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputLabel.displayName = "InputLabel";

const InputTextField = ({ children, className, fullWidth }) => {
  return (
    <div
      className={cn(
        "flex items-center sm:gap-1 md:gap-2 h-12 bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 dark:border-customNeutral-300 focus-within:border-lavender-400 dark:focus-within:border-lavender-100  dark:bg-customNeutral-600  dark:placeholder:text-customNeutral-200 px-3",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </div>
  );
};
InputTextField.displayName = "InputTextField";

const InputIcon = ({ children }) => {
  return <div className="[&_svg]:size-6 [&_svg]:shrink-0">{children}</div>;
};
InputIcon.displayName = "InputIcon";

const Input = React.forwardRef(
  ({ className, type, fullWidth, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex-1 outline-none bg-transparent file:text-customNeutral-100 file:text-sm file:font-medium placeholder:text-customNeutral-300 disabled:cursor-not-allowed disabled:opacity-50 dark:file:text-customNeutral-100 dark:caret-lavender-100 dark:text-customNeutral-100 md:text-sm",
          type === "date" &&
            "dark:[&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer ",
          type === "time" &&
            "dark:[&::-webkit-time-picker-indicator]:invert dark:[&::-webkit-time-picker-indicator]:opacity-70 [&::-webkit-time-picker-indicator]:cursor-pointer ",
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputArea = React.forwardRef(
  ({ className, rows = 4, fullWidth, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex-1 outline-none bg-inherit file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-customNeutral-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
);
InputArea.displayName = "InputArea";

const InputAreaField = ({ children, className, fullWidth }) => {
  return (
    <div
      className={cn(
        "flex bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 focus-within:border-lavender-400 dark:text-customNeutral-100 dark:border-customNeutral-200  dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 px-3 py-2",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </div>
  );
};
InputAreaField.displayName = "InputAreaField";

export {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input,
  InputArea,
  InputAreaField
};
