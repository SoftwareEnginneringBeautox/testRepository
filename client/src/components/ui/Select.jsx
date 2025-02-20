import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import { cva } from "class-variance-authority";

const selectVariants = cva(
  "flex gap-2 items-center justify-between rounded-lg whitespace-nowrap placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default:
          "bg-lavender-400 text-customNeutral-100 px-4 py-3 font-semibold",
        modal:
          "bg-customNeutral-100 text-neutral-950 border-2 border-customNeutral-200 dark:border-neutral-800 dark:bg-neutral-950 px-3 py-2 max-h-12 outline-none flex-row font-normal"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(
  ({ className, variant, placeholder, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectVariants({ variant }),
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      {variant === "modal" && (
        <SelectIcon>
          {
            React.Children.toArray(children).find(
              (child) =>
                React.isValidElement(child) && child.type === SelectIcon
            )?.props.children
          }
        </SelectIcon>
      )}

      <div className={cn("flex-1 text-left", variant === "modal" && "text-sm")}>
        <SelectValue
          placeholder={
            <span
              className={cn(
                "font-normal",
                variant === "modal"
                  ? "text-sm text-customNeutral-300"
                  : "text-customNeutral-100"
              )}
            >
              {placeholder}
            </span>
          }
        />
        {!props.value && variant === "default" && (
          <span className="text-customNeutral-100">{placeholder}</span>
        )}
      </div>

      <div className="flex gap-2 items-center">
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectIcon = ({ children, className }) => (
  <div className={cn("[&_svg]:size-6 [&_svg]:shrink-0", className)}>
    {children}
  </div>
);
SelectIcon.displayName = "SelectIcon";

const ModalSelectTrigger = ({ className, children, ...props }, ref) => (
  <SelectTrigger ref={ref} variant="modal" className={cn(className)} {...props}>
    {children}
  </SelectTrigger>
);

const ModalSelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectContent
      ref={ref}
      variant="modal"
      className={cn(className)}
      {...props}
    >
      {children}
    </SelectContent>
  )
);

const ModalSelect = ({ placeholder, children, ...props }) => {
  return (
    <Select {...props}>
      <SelectTrigger variant="modal">
        <SelectIcon>
          <FilterIcon />
        </SelectIcon>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
};

ModalSelect.Trigger = ModalSelectTrigger;
ModalSelect.Content = ModalSelectContent;

const SelectScrollUpButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  )
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  )
);
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef(
  ({ className, variant, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-customNeutral-100 text-popover-foreground shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          variant === "modal" && "text-sm",
          className
        )}
        position={position}
        sideOffset={4}
        align="start"
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1 w-full">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 outline-none focus:bg-accent hover:bg-lavender-100 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  ModalSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectIcon
};
