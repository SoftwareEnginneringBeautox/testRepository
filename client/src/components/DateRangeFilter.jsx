import React, { useState, useEffect } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/Popover";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import CalendarIcon from "@/assets/icons/CalendarIcon";

const DateRangeFilter = ({ onFilterChange, className }) => {
  // Calculate the default dates (will be used in multiple places)
  const getDefaultDates = () => {
    const today = new Date();

    // Default start date (30 days ago)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);

    return {
      startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      endDate: today.toISOString().split("T")[0] // Format as YYYY-MM-DD
    };
  };

  // State for date inputs (initialize with default values)
  const [startDate, setStartDate] = useState(getDefaultDates().startDate);
  const [endDate, setEndDate] = useState(getDefaultDates().endDate);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: ""
  });

  // Calculate the minimum date (6 months ago)
  const getSixMonthsAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Calculate today's date for maximum value
  const getToday = () => {
    return new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Reset filter function
  const resetFilter = () => {
    // Reset to default values instead of empty strings
    const defaults = getDefaultDates();
    setStartDate(defaults.startDate);
    setEndDate(defaults.endDate);
    setIsActive(false);
    onFilterChange(null, null, false);
    setErrors({ startDate: "", endDate: "" });
  };

  // Apply filter function
  const applyFilter = () => {
    // Validate dates
    const newErrors = validateDates();

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setIsActive(true);
    setIsOpen(false);
    onFilterChange(startDate, endDate, true);
  };

  // Validate dates
  const validateDates = () => {
    const errors = {
      startDate: "",
      endDate: ""
    };

    // Validate start date
    if (!startDate) {
      errors.startDate = "Start date is required";
    } else if (new Date(startDate) > new Date()) {
      errors.startDate = "Start date cannot be in the future";
    }

    // Validate end date
    if (!endDate) {
      errors.endDate = "End date is required";
    } else if (new Date(endDate) > new Date()) {
      errors.endDate = "End date cannot be in the future";
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      errors.endDate = "End date cannot be before start date";
    }

    return errors;
  };

  // Format date for display in tooltip (MM/DD/YYYY format)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });
  };

  // Generate tooltip text
  const getTooltipText = () => {
    if (isActive) {
      return `Date Filter: ${formatDateForDisplay(
        startDate
      )} - ${formatDateForDisplay(endDate)}`;
    }
    return "Filter by Date";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            // Match the exact style used in SelectTrigger
            "bg-lavender-400 text-customNeutral-100 px-4 py-3 font-semibold",
            "flex items-center gap-2 h-12",
            "rounded-lg whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            // For icon-only button, ensure it's square and centered
            "flex justify-center items-center aspect-square",
            // Active state
            isActive
              ? "border-2 border-lavender-300 dark:border-lavender-200"
              : "",
            className
          )}
          data-cy="date-range-filter-trigger"
          title={getTooltipText()}
        >
          <CalendarIcon className="w-6 h-6" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 md:w-96 p-4 rounded-lg bg-customNeutral-100 dark:bg-customNeutral-400 dark:text-customNeutral-100 shadow-md border border-customNeutral-200 dark:border-transparent"
        align="start"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">FILTER BY DATE RANGE</h3>
            {isActive && (
              <div className="text-xs text-lavender-400 dark:text-lavender-100 font-medium">
                FILTER ACTIVE
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <InputContainer>
              <InputLabel>START DATE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="date-range-start-input"
                  type="date"
                  placeholder="Select start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={getToday()}
                  min={getSixMonthsAgo()}
                  className={errors.startDate ? "border-red-500" : ""}
                />
              </InputTextField>
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </InputContainer>

            <InputContainer>
              <InputLabel>END DATE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="date-range-end-input"
                  type="date"
                  placeholder="Select end date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={getToday()}
                  min={startDate || getSixMonthsAgo()}
                  className={errors.endDate ? "border-red-500" : ""}
                />
              </InputTextField>
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </InputContainer>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={resetFilter}
              data-cy="reset-date-filter"
            >
              SET TO DEFAULT
            </Button>
            <Button
              variant="callToAction"
              className="flex-1 text-xs"
              onClick={applyFilter}
              data-cy="apply-date-filter"
            >
              APPLY FILTER
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
