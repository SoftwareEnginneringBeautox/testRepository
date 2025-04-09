import React, { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import FilterIcon from "@/assets/icons/FilterIcon";

const MultiSelectFilter = ({
  options,
  selectedValues,
  setSelectedValues,
  placeholder = "Select options",
  mandatoryValues = [], // Add support for mandatory values
  showApplyButton = true,
  onApply // Optional callback for when changes are applied
}) => {
  const [tempSelectedValues, setTempSelectedValues] = useState([
    ...selectedValues
  ]);

  const handleOpenChange = (open) => {
    if (open) {
      setTempSelectedValues([...selectedValues]);
    }
  };

  const handleChange = (optionValue) => {
    // Check if the value is mandatory
    if (mandatoryValues.includes(optionValue)) {
      return; // Don't allow unchecking mandatory values
    }

    const newSelected = tempSelectedValues.includes(optionValue)
      ? tempSelectedValues.filter((v) => v !== optionValue)
      : [...tempSelectedValues, optionValue];

    // Ensure mandatory values are always included
    const finalSelected = [...new Set([...mandatoryValues, ...newSelected])];
    setTempSelectedValues(finalSelected);
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allValues = options.map((opt) => opt.value);
      setTempSelectedValues(allValues);
    } else {
      // When deselecting all, keep only mandatory values
      setTempSelectedValues([...mandatoryValues]);
    }
  };

  const handleApply = () => {
    // Ensure mandatory values are included
    const finalValues = [
      ...new Set([...mandatoryValues, ...tempSelectedValues])
    ];
    setSelectedValues(finalValues);
    if (onApply) {
      onApply(finalValues);
    }
  };

  const allSelected = tempSelectedValues.length === options.length;

  return (
    <Select
      className="w-full md:w-auto"
      data-cy="multi-select-filter"
      onOpenChange={handleOpenChange}
    >
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
        <div className="flex flex-col">
          <div className="flex-1 overflow-y-auto max-h-64">
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
                  checked={tempSelectedValues.includes(option.value)}
                  onCheckedChange={() => handleChange(option.value)}
                  id={`checkbox-${option.value}`}
                  data-cy={`checkbox-${option.value}`}
                  disabled={mandatoryValues.includes(option.value)}
                />
                <label
                  htmlFor={`checkbox-${option.value}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.label}
                  {mandatoryValues.includes(option.value) && " (required)"}
                </label>
              </div>
            ))}
          </div>
          {showApplyButton && (
            <div className="mt-2 pt-2 px-2 pb-2">
              <Button
                variant="callToAction"
                fullWidth={true}
                size="sm"
                onClick={handleApply}
                data-cy="apply-filter-button"
              >
                APPLY
              </Button>
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

export default MultiSelectFilter;
