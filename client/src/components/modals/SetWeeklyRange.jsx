import React, { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import {
  Select,
  SelectItem,
  ModalSelectTrigger,
  ModalSelectContent
} from "@/components/ui/Select";

import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import DownloadIcon from "@/assets/icons/DownloadIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

// Function to generate week options for the past 24 weeks
const generateWeekOptions = () => {
  const options = [];
  const today = new Date();

  for (let i = 0; i < 24; i++) {
    // Calculate the start date of the week (i weeks ago)
    const weekStart = startOfWeek(subDays(today, i * 7));
    const weekEnd = endOfWeek(weekStart);

    // Format the dates
    const startFormatted = format(weekStart, "MMM dd, yyyy");
    const endFormatted = format(weekEnd, "MMM dd, yyyy");

    // Create week option with date range and value
    options.push({
      label: `${startFormatted} - ${endFormatted}`,
      value: `${format(weekStart, "yyyy-MM-dd")}:${format(
        weekEnd,
        "yyyy-MM-dd"
      )}`,
      startDate: weekStart,
      endDate: weekEnd
    });
  }

  return options;
};

// Get today's date formatted as YYYY-MM-DD
const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

// Calculate the date 6 months ago formatted as YYYY-MM-DD
const getSixMonthsAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return date.toISOString().split("T")[0];
};

function SetWeeklyRange({ isOpen, onClose, onConfirm, reportType }) {
  // Tab state
  const [activeTab, setActiveTab] = useState("weekly");

  // Weekly selection state
  const [selectedWeek, setSelectedWeek] = useState("");
  const [weekOptions] = useState(generateWeekOptions);

  // Custom date range state
  const [startDate, setStartDate] = useState(getSixMonthsAgo());
  const [endDate, setEndDate] = useState(getToday());
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get file extension based on report type
  const fileFormat = reportType === "pdf" ? "PDF" : "Excel";

  // Set default selected week to the most recent week
  useEffect(() => {
    if (isOpen) {
      if (weekOptions.length > 0) {
        setSelectedWeek(weekOptions[0].value);
      }

      // Reset custom date range values
      setStartDate(getSixMonthsAgo());
      setEndDate(getToday());
      setErrors({ startDate: "", endDate: "" });

      // Default to weekly tab
      setActiveTab("weekly");
    }
  }, [isOpen, weekOptions]);

  if (!isOpen) return null;

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  const validateCustomDateRange = () => {
    const sixMonthsAgo = new Date(getSixMonthsAgo());
    const today = new Date(getToday());
    const start = new Date(startDate);
    const end = new Date(endDate);

    const newErrors = {
      startDate: "",
      endDate: ""
    };

    // Validate start date
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    } else if (start > today) {
      newErrors.startDate = "Start date cannot be in the future";
    } else if (start < sixMonthsAgo) {
      newErrors.startDate = "Start date cannot be older than 6 months";
    }

    // Validate end date
    if (!endDate) {
      newErrors.endDate = "End date is required";
    } else if (end > today) {
      newErrors.endDate = "End date cannot be in the future";
    } else if (end < start) {
      newErrors.endDate = "End date cannot be before start date";
    }

    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.startDate && !newErrors.endDate;
  };

  const handleConfirm = () => {
    setIsSubmitting(true);

    if (activeTab === "weekly") {
      // Handle weekly selection
      if (!selectedWeek) {
        setIsSubmitting(false);
        return;
      }

      // Find the selected week option to get the date range
      const selectedOption = weekOptions.find(
        (option) => option.value === selectedWeek
      );

      if (selectedOption) {
        const { startDate, endDate } = selectedOption;

        // Call the onConfirm callback with the selected date range and report type
        onConfirm(startDate, endDate, reportType);
      }
    } else {
      // Handle custom date range
      if (validateCustomDateRange()) {
        onConfirm(new Date(startDate), new Date(endDate), reportType);
      } else {
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <ModalContainer
      data-cy="download-weekly-records-modal"
      className="flex flex-col gap-4"
    >
      <ModalHeader className="mb-0">
        <ModalIcon>
          <DownloadIcon />
        </ModalIcon>
        <ModalTitle>
          {reportType === "pdf"
            ? "DOWNLOAD WEEKLY REPORT"
            : "DOWNLOAD WEEKLY DATA"}
        </ModalTitle>
      </ModalHeader>
      <ModalBody className="mt-0">
        <p className="dark:text-customNeutral-100">
          Kindly confirm the range of records you want to download as{" "}
          {fileFormat}.
        </p>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full my-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly" data-cy="weekly-tab">
              Weekly Selection
            </TabsTrigger>
            <TabsTrigger value="custom" data-cy="custom-range-tab">
              Custom Range
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            <InputContainer className="flex-1">
              <InputLabel>WEEKLY DATE RANGE</InputLabel>
              <Select value={selectedWeek} onValueChange={handleWeekChange}>
                <ModalSelectTrigger
                  data-cy="weekly-date-select"
                  icon={<CalendarIcon className="w-4 h-4" />}
                  placeholder="Select which data to download"
                >
                  {selectedWeek
                    ? weekOptions.find(
                        (option) => option.value === selectedWeek
                      )?.label
                    : "Select date range"}
                </ModalSelectTrigger>
                <ModalSelectContent>
                  {weekOptions.map((option, index) => (
                    <SelectItem
                      key={index}
                      value={option.value}
                      data-cy={`weekly-date-option-${index}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </ModalSelectContent>
              </Select>
            </InputContainer>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="flex flex-row w-full gap-4">
              <InputContainer className="flex-1">
                <InputLabel>STARTING DATE</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <CalendarIcon />
                  </InputIcon>
                  <Input
                    data-cy="starting-range-input"
                    type="date"
                    placeholder="Set initial date for the range"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={getSixMonthsAgo()}
                    max={getToday()}
                    required
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                </InputTextField>
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </InputContainer>
              <InputContainer className="flex-1">
                <InputLabel>ENDING DATE</InputLabel>
                <InputTextField>
                  <InputIcon>
                    <CalendarIcon />
                  </InputIcon>
                  <Input
                    data-cy="ending-range-input"
                    type="date"
                    placeholder="Set end date for the range"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || getSixMonthsAgo()}
                    max={getToday()}
                    required
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                </InputTextField>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </InputContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex sm:flex-row flex-col gap-4 w-full mt-4">
          <Button
            data-cy="cancel-download-weekly"
            variant="outline"
            className="md:w-1/2"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <ChevronLeftIcon />
            CANCEL AND RETURN
          </Button>
          <Button
            data-cy="confirm-download-weekly"
            className="md:w-1/2"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "PROCESSING..."
              : `GENERATE ${fileFormat.toUpperCase()}`}
            <ChevronRightIcon />
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default SetWeeklyRange;
