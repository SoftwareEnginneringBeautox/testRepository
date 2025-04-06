import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue
} from "@/components/ui/Select";
import FilterIcon from "@/assets/icons/FilterIcon";

const MultiSelectFilter = ({
  options,
  selectedValues,
  setSelectedValues,
  placeholder = "Select options"
}) => {
  const handleChange = (optionValue) => {
    const newSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newSelected);
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allValues = options.map((opt) => opt.value);
      setSelectedValues(allValues);
    } else {
      setSelectedValues([]);
    }
  };

  const allSelected = selectedValues.length === options.length;

  return (
    <Select className="w-full md:w-auto" data-cy="multi-select-filter">
      <SelectTrigger
        placeholder={placeholder}
        icon={<FilterIcon />}
        data-cy="multi-select-trigger"
      >
        <SelectValue>
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            id="select-all-checkbox"
            data-cy="select-all-checkbox"
          />
          <label
            htmlFor="select-all-checkbox"
            className="flex-1 cursor-pointer text-sm"
          >
            Select All
          </label>
        </div>
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-2 px-2 py-1.5"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleChange(option.value)}
              id={`checkbox-${option.value}`}
              data-cy={`checkbox-${option.value}`}
            />
            <label
              htmlFor={`checkbox-${option.value}`}
              className="flex-1 cursor-pointer text-sm"
            >
              {option.label}
            </label>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MultiSelectFilter;
