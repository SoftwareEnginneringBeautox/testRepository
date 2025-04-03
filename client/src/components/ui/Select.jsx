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
          "bg-lavender-400 text-customNeutral-100 px-4 py-3 font-semibold ",
        modal:
          "bg-customNeutral-100 border-2 border-customNeutral-200 dark:border-neutral-800 dark:bg-neutral-950 px-3 py-2 max-h-12 outline-none flex-row font-normal text-sm"
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
  (
    { className, variant = "default", placeholder, icon: RightIcon, ...props },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectVariants({ variant }),
        "flex items-center gap-2 h-12 ",
        className
      )}
      {...props}
    >
      {/* Selected Value or Placeholder */}
      <SelectValue
        placeholder={placeholder}
        className="text-left truncate flex-1 "
      />

      {/* ChevronDown Icon with dynamic color */}
      <SelectIcon variant={variant}>
        <ChevronDownIcon />
      </SelectIcon>

      {/* Optional Right Icon for Default Variant */}
      {variant === "default" && RightIcon && (
        <SelectIcon variant={variant} className="text-customNeutral-100">
          {RightIcon}
        </SelectIcon>
      )}
    </SelectPrimitive.Trigger>
  )
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectIcon = ({ children, className, variant }) => (
  <div
    className={cn(
      "[&_svg]:size-6 [&_svg]:shrink-0",
      variant === "default"
        ? "text-customNeutral-100"
        : "text-customNeutral-700",
      "data-[placeholder]:text-customNeutral-200", // Keep this for placeholders
      className
    )}
  >
    {children}
  </div>
);

SelectIcon.displayName = "SelectIcon";

const ModalSelectTrigger = React.forwardRef(
  ({ className, placeholder, icon: LeftIcon, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectVariants({ variant: "modal" }),
        "flex items-center justify-between gap-2 w-full px-3 py-2 bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 text-neutral-900",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {LeftIcon && <SelectIcon variant="modal">{LeftIcon}</SelectIcon>}

        {/* Use the proper SelectValue component */}
        <SelectValue placeholder={placeholder} />
      </div>

      <SelectIcon variant="modal">
        <ChevronDownIcon className="w-4 h-4 shrink-0" />
      </SelectIcon>
    </SelectPrimitive.Trigger>
  )
);
ModalSelectTrigger.displayName = "ModalSelectTrigger";

const ModalSelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-[90vh] w-full min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-md border bg-customNeutral-100 text-popover-foreground shadow-md text-sm",
          className
        )}
        position="popper"
        sideOffset={4}
        align="start"
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1 w-full max-h-60 overflow-y-auto">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
ModalSelectContent.displayName = "ModalSelectContent";

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
          "relative z-50 max-h-96 w-full min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-md border bg-customNeutral-100 text-popover-foreground shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          variant === "modal" && "text-sm",
          className
        )}
        position={position}
        sideOffset={4}
        align="start"
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1 w-full max-h-60 overflow-y-auto">
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
  SelectGroup,
  SelectTrigger,
  ModalSelectTrigger,
  SelectContent,
  ModalSelectContent,
  SelectItem,
  SelectLabel,
  SelectIcon,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton
};
