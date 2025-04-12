import React, { useState, useEffect, useRef } from "react";

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
  AlertContainer,
  AlertText,
  AlertTitle,
  AlertDescription,
  CloseAlert
} from "@/components/ui/Alert";

import { Button } from "../ui/Button";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function EditCategory({ isOpen, onClose, category, onEditSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const submitInProgressRef = useRef(false);

  // Set the initial category name when the category prop changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
    }
  }, [category]);

  useEffect(() => {
    // Reset submission status when modal opens/closes
    return () => {
      submitInProgressRef.current = false;
      setIsSubmitting(false);
    };
  }, [isOpen]);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check both state AND ref to prevent race conditions
    if (isSubmitting || submitInProgressRef.current) {
      console.log("Submission already in progress");
      return;
    }
    
    submitInProgressRef.current = true;

    if (!categoryName || !categoryName.trim()) {
      setAlertTitle("Error");
      setAlertMessage("Please enter a category name");
      setShowAlert(true);
      submitInProgressRef.current = false;
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API to update the category
      const response = await fetch(
        `http://localhost:4000/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName })
        }
      );

      const result = await response.json();

      if (result.success) {
        // If onEditSuccess callback is provided, call it
        if (onEditSuccess) {
          onEditSuccess({
            id: category.id,
            name: categoryName
          });
        }
        // Close the modal
        onClose();
      } else {
        setAlertTitle("Error");
        setAlertMessage(result.message || "Error updating category");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setAlertTitle("Error");
      setAlertMessage("An error occurred. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
      submitInProgressRef.current = false;
    }
  };

  if (!isOpen || !category) return null;

  return (
    <ModalContainer data-cy="edit-category-modal">
      {showAlert && (
        <AlertContainer>
          <AlertText>
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </AlertText>
          <CloseAlert onClick={handleAlertClose} />
        </AlertContainer>
      )}
      <ModalHeader>
        <ModalIcon>
          <ExpenseTypeIcon />
        </ModalIcon>
        <ModalTitle data-cy="edit-category-title">
          EDIT EXPENSE CATEGORY
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} data-cy="edit-category-form">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>CATEGORY NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ExpenseTypeIcon />
                </InputIcon>
                <Input
                  data-cy="category-name-input"
                  type="text"
                  id="categoryName"
                  placeholder="Set the name of the category"
                  maxLength={50} // Add maximum length
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-edit-category-btn"
              type="button"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-edit-category"
              type="submit"
              className="md:w-1/2"
              disabled={isSubmitting}
            >
              <EditIcon />
              {isSubmitting ? "SAVING..." : "EDIT CATEGORY"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditCategory;
