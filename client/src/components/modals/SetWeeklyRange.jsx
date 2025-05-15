import React, { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

import { InputContainer, InputLabel } from "@/components/ui/Input";

import {
  Select,
  SelectItem,
  ModalSelectTrigger,
  ModalSelectContent
} from "@/components/ui/Select";

import { Button } from "../ui/Button";

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

function SetWeeklyRange({ isOpen, onClose, onConfirm, reportType }) {
  const [selectedWeek, setSelectedWeek] = useState("");
  const [weekOptions] = useState(generateWeekOptions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get file extension based on report type
  const fileFormat = reportType === "pdf" ? "PDF" : "Excel";

  // Set default selected week to the most recent week
  useEffect(() => {
    if (weekOptions.length > 0) {
      setSelectedWeek(weekOptions[0].value);
    }
  }, [weekOptions]);

  if (!isOpen) return null;

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  const handleConfirm = () => {
    if (!selectedWeek) return;

    setIsSubmitting(true);

    // Find the selected week option to get the date range
    const selectedOption = weekOptions.find(
      (option) => option.value === selectedWeek
    );

    if (selectedOption) {
      const { startDate, endDate } = selectedOption;

      // Call the onConfirm callback with the selected date range and report type
      onConfirm(startDate, endDate, reportType);
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
          {fileFormat}. By default it is set to download the most recent week's
          records.
        </p>
        <div className="flex flex-row w-full gap-4 my-4">
          <InputContainer className="flex-1">
            <InputLabel>WEEKLY DATE RANGE</InputLabel>
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
              <ModalSelectTrigger
                data-cy="weekly-date-select"
                icon={<CalendarIcon className="w-4 h-4" />}
                placeholder="Select which data to download"
              >
                {selectedWeek
                  ? weekOptions.find((option) => option.value === selectedWeek)
                      ?.label
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
        </div>
        <div className="flex sm:flex-row flex-col gap-4 w-full">
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
              : `GENERATE ${fileFormat.toLocaleUpperCase()}`}
            <ChevronRightIcon />
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default SetWeeklyRange;
