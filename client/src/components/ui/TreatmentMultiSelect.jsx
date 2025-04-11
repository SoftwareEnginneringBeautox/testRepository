import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/checkbox";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import { cn } from "@/lib/utils";

export function TreatmentMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select treatments",
  className
}) {
  const handleChange = (id) => {
    const newValue = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange?.(newValue);
  };

  const displayText = (() => {
    if (!Array.isArray(value)) return placeholder;
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const selectedOption = options.find((opt) => opt.value === value[0]);
      return selectedOption?.label || placeholder;
    }
    return `${value.length} selected`;
  })();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-between w-full px-3 h-12 bg-customNeutral-100 rounded-lg border-2 border-customNeutral-200 dark:border-customNeutral-300 dark:bg-customNeutral-600 focus-within:border-lavender-400 dark:focus-within:border-lavender-100 cursor-pointer",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="[&_svg]:size-6 [&_svg]:shrink-0 text-customNeutral-700 dark:text-customNeutral-100">
              <TreatmentIcon />
            </div>
            <div
              className="flex-1 truncate text-sm data-[placeholder=true]:text-customNeutral-300 dark:data-[placeholder=true]:text-customNeutral-300 dark:text-customNeutral-100"
              data-placeholder={value.length === 0}
            >
              {displayText}
            </div>
          </div>
          <div className="[&_svg]:size-6 [&_svg]:shrink-0 text-customNeutral-700 dark:text-customNeutral-100 transition-transform">
            <ChevronDownIcon />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "relative z-50 bg-customNeutral-100 dark:bg-customNeutral-400 dark:text-customNeutral-100 shadow-md rounded-md p-1 max-h-60 overflow-y-auto min-w-[var(--radix-popover-trigger-width)]",
          // Scrollbar-specific styling
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-400"
        )}
      >
        {Array.isArray(options) && options.length > 0 ? (
          options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-lavender-100 dark:hover:text-lavender-400 rounded-sm cursor-pointer w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleChange(option.value);
              }}
              data-cy={`option-${option.value}`}
            >
              <Checkbox
                checked={value.includes(option.value)}
                onCheckedChange={() => handleChange(option.value)}
                id={`checkbox-${option.value}`}
              />
              <label
                htmlFor={`checkbox-${option.value}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {option.label}
              </label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground px-2 py-1">
            No options available
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
