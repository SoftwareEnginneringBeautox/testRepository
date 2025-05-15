import React, { useState, useEffect } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

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

// Function to generate month options for the past 6 months
const generateMonthOptions = () => {
  const options = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    // Calculate the start date of the month (i months ago)
    const monthStart = startOfMonth(subMonths(today, i));
    const monthEnd = endOfMonth(monthStart);

    // Format the dates
    const monthFormatted = format(monthStart, "MMMM yyyy");

    // Create month option with date range and value
    options.push({
      label: monthFormatted,
      value: `${format(monthStart, "yyyy-MM-dd")}:${format(
        monthEnd,
        "yyyy-MM-dd"
      )}`,
      startDate: monthStart,
      endDate: monthEnd
    });
  }

  return options;
};

function SetMonthlyRange({ isOpen, onClose, onConfirm, reportType }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthOptions] = useState(generateMonthOptions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get file extension based on report type
  const fileFormat = reportType === "pdf" ? "PDF" : "EXCEL";

  // Set default selected month to the current month
  useEffect(() => {
    if (monthOptions.length > 0) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions]);

  if (!isOpen) return null;

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleConfirm = () => {
    if (!selectedMonth) return;

    setIsSubmitting(true);

    // Find the selected month option to get the date range
    const selectedOption = monthOptions.find(
      (option) => option.value === selectedMonth
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
      data-cy="download-monthly-records-modal"
      className="flex flex-col gap-4"
    >
      <ModalHeader className="mb-0">
        <ModalIcon>
          <DownloadIcon />
        </ModalIcon>
        <ModalTitle>
          {reportType === "pdf"
            ? "DOWNLOAD MONTHLY REPORT"
            : "DOWNLOAD MONTHLY DATA"}
        </ModalTitle>
      </ModalHeader>
      <ModalBody className="mt-0">
        <p className="dark:text-customNeutral-100">
          Kindly confirm the range of records you want to download as{" "}
          {fileFormat}. By default it is set to download the current month's
          records.
        </p>
        <div className="flex flex-row w-full gap-4 my-4">
          <InputContainer className="flex-1">
            <InputLabel>MONTHLY DATE RANGE</InputLabel>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <ModalSelectTrigger
                data-cy="monthly-date-select"
                icon={<CalendarIcon className="w-4 h-4" />}
                placeholder="Select which data to download"
              >
                {selectedMonth
                  ? monthOptions.find(
                      (option) => option.value === selectedMonth
                    )?.label
                  : "Select date range"}
              </ModalSelectTrigger>
              <ModalSelectContent>
                {monthOptions.map((option, index) => (
                  <SelectItem
                    key={index}
                    value={option.value}
                    data-cy={`monthly-date-option-${index}`}
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
            data-cy="cancel-download-monthly"
            variant="outline"
            className="md:w-1/2"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <ChevronLeftIcon />
            CANCEL AND RETURN
          </Button>
          <Button
            data-cy="confirm-download-monthly"
            className="md:w-1/2"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "PROCESSING..." : `CONFIRM ${fileFormat}`}
            <ChevronRightIcon />
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default SetMonthlyRange;
