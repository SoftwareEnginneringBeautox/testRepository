import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./Checkbox";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";

const MultiSelectCheckbox = React.forwardRef(
  (
    {
      className,
      options = [],
      value = [],
      onChange,
      placeholder = "Select options...",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (optionValue) => {
      if (!Array.isArray(value)) return;

      const newSelected = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];

      onChange?.(newSelected);
    };

    const displayText = React.useMemo(() => {
      if (!Array.isArray(value)) return placeholder;
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const selectedOption = options.find((opt) => opt.value === value[0]);
        return selectedOption?.label || placeholder;
      }
      return `${value.length} items selected`;
    }, [value, options, placeholder]);

    return (
      <div
        className="relative w-full"
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        {...props}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 w-full px-3 py-2 bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 focus-within:border-lavender-400 dark:border-neutral-800 dark:bg-neutral-950 cursor-pointer",
            isOpen && "border-lavender-400",
            className
          )}
          onClick={toggleDropdown}
          data-cy="multi-select-trigger"
        >
          <div className="flex-1 truncate text-sm">{displayText}</div>
          <div
            className={cn(
              "[&_svg]:size-6 [&_svg]:shrink-0 text-customNeutral-700 transition-transform",
              isOpen && "transform rotate-180"
            )}
          >
            <ChevronDownIcon />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-customNeutral-100 rounded-md border shadow-md">
            <div className="p-2 max-h-60 overflow-y-auto">
              {Array.isArray(options) && options.length > 0 ? (
                options.map((option) =>
                  option?.value != null ? (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-lavender-100 rounded-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(option.value);
                      }}
                      data-cy={`option-${option.value}`}
                    >
                      <Checkbox
                        checked={value.includes(option.value)}
                        onCheckedChange={() =>
                          handleCheckboxChange(option.value)
                        }
                        id={`checkbox-${option.value}`}
                      />
                      <label
                        htmlFor={`checkbox-${option.value}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {option.label}
                      </label>
                    </div>
                  ) : null
                )
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-1">
                  No options available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MultiSelectCheckbox.displayName = "MultiSelectCheckbox";

export { MultiSelectCheckbox };
