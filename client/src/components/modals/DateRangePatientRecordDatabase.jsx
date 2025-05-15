import React, { useState, useEffect } from "react";

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

import { Button } from "../ui/Button";

import DownloadIcon from "@/assets/icons/DownloadIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

function DateRangePatientRecordDatabase({ isOpen, onClose, onSubmit }) {
  // State for date inputs
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  // Set default values when modal opens
  useEffect(() => {
    if (isOpen) {
      const sixMonthsAgo = getSixMonthsAgo();
      const today = getToday();

      setStartDate(sixMonthsAgo);
      setEndDate(today);
      setErrors({ startDate: "", endDate: "" });
    }
  }, [isOpen]);

  // Validate dates and handle form submission
  const handleSubmit = () => {
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

    // If no errors, submit the form
    if (!newErrors.startDate && !newErrors.endDate) {
      onSubmit(startDate, endDate);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer data-cy="print-records-modal" className="flex flex-col">
      <ModalHeader className="mb-0">
        <ModalIcon>
          <DownloadIcon />
        </ModalIcon>
        <ModalTitle>DOWNLOAD PATIENT RECORDS</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p className="dark:text-customNeutral-100">
          Kindly confirm the range of records you want to download. By default
          it is set to download all past patient records within the past 6
          months.
        </p>
        <div className="flex flex-row w-full gap-4 my-4">
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
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
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
        <div className="flex sm:flex-row flex-col gap-4 w-full">
          <Button
            data-cy="cancel-print-prd"
            variant="outline"
            className="md:w-1/2"
            onClick={onClose}
          >
            <ChevronLeftIcon />
            CANCEL AND RETURN
          </Button>
          <Button
            data-cy="confirm-print-prd"
            className="md:w-1/2"
            onClick={handleSubmit}
          >
            GENERATE REPORT
            <DownloadIcon />
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default DateRangePatientRecordDatabase;
