import React, { useState } from "react";

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

import PesoIcon from "@/assets/icons/PesoIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function CreateCategory({ isOpen, onClose, onCreateSuccess, categories = [] }) {
  // Add state for the category name
  const [categoryName, setCategoryName] = useState("");
  // Add state for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setCategoryName(e.target.value);
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    // Check for duplicate category names (case insensitive)
    const isDuplicate = categories.some(
      category => category.name.toLowerCase() === categoryName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("A category with this name already exists");
      return;
    }
    setIsSubmitting(true);

    try {
      console.log("Making API call to create category:", categoryName);
      // Call the API to create a new category
      const response = await fetch("http://localhost:4000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create category");
      }

      // Call the parent component's callback with the new category
      if (onCreateSuccess) {
        onCreateSuccess({
          id: result.id,
          name: categoryName.trim()
        });
      }

      // Close the modal
      onClose();
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.message || "An error occurred while creating the category");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <ModalContainer data-cy="create-category-modal">
      <ModalHeader>
        <ModalIcon>
          <ExpenseTypeIcon />
        </ModalIcon>
        <ModalTitle>CREATE EXPENSE CATEGORY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} data-cy="create-category-form">
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
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
            {error && (
              <div 
                data-cy="category-error-message"
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mt-2"
              >
                {error}
              </div>
            )}
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-category-btn"
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-create-category"
              type="submit"
              className="w-1/2"
              disabled={isSubmitting}
            >
              <PlusIcon />
              {isSubmitting ? "ADDING..." : "ADD CATEGORY"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateCategory;