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
        "flex items-center sm:gap-1 md:gap-2 h-12 bg-[var(--input-bg)] rounded-lg border-2 border-[var(--input-border)] focus-within:border-[var(--input-focus-border)] px-3",
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
          "flex-1 outline-none bg-inherit text-[var(--input-text)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--input-file-text)] placeholder:text-[var(--input-placeholder)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
        "flex-1 outline-none bg-inherit text-[var(--input-text)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--input-file-text)] placeholder:text-[var(--input-placeholder)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
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
        "flex bg-[var(--input-bg)] rounded-lg border-2 border-[var(--input-border)] focus-within:border-[var(--input-focus-border)] px-3 py-2",
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
