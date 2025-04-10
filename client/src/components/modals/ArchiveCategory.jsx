import React, { useState } from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";
import {
  AlertContainer,
  AlertText,
  AlertTitle,
  AlertDescription,
  CloseAlert
} from "@/components/ui/Alert";

import { Button } from "../ui/Button";

import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

function ArchiveCategory({ isOpen, onClose, category, onArchiveSuccess }) {
  // Add state for tracking archive operation
  const [isArchiving, setIsArchiving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleArchive = async () => {
    if (!category) return;

    setIsArchiving(true);

    try {
      // Call the API to archive the category
      const response = await fetch(
        `http://localhost:4000/api/categories/${category.id}/archive`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" }
        }
      );

      const result = await response.json();

      if (result.success) {
        // If onArchiveSuccess callback is provided, call it
        if (onArchiveSuccess) {
          onArchiveSuccess(category.id);
        }
        // Close the modal
        onClose();
      } else {
        setAlertTitle("Error");
        setAlertMessage(result.message || "Error archiving category");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error archiving category:", error);
      setAlertTitle("Error");
      setAlertMessage("An error occurred. Please try again.");
      setShowAlert(true);
    } finally {
      setIsArchiving(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <ModalContainer className="flex flex-col gap-4">
      {showAlert && (
        <AlertContainer>
          <AlertText>
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </AlertText>
          <CloseAlert onClick={handleAlertClose} />
        </AlertContainer>
      )}
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ARCHIVE CATEGORY?</ModalTitle>
      <p className="dark:text-customNeutral-100">
        This will archive the expense category "{category.name}" from the
        database.
      </p>
      <div className="flex flex-row gap-4 w-full">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={onClose}
          disabled={isArchiving}
        >
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button
          type="button"
          className="w-1/2"
          onClick={handleArchive}
          disabled={isArchiving}
        >
          <ArchiveIcon />
          {isArchiving ? "ARCHIVING..." : "ARCHIVE CATEGORY"}
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchiveCategory;
