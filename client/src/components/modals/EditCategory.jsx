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

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function EditCategory({ isOpen, onClose, category, onEditSuccess }) {
  // Add state for the category name
  const [categoryName, setCategoryName] = useState("");
  // Add state for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the initial category name when the category prop changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName || !categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API to update the category
      const response = await fetch(`http://localhost:4000/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });
      
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
        alert(result.message || "Error updating category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <ExpenseTypeIcon />
        </ModalIcon>
        <ModalTitle>EDIT EXPENSE CATEGORY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>CATEGORY NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ExpenseTypeIcon />
                </InputIcon>
                <Input
                  type="text"
                  id="categoryName"
                  placeholder="Set the name of the category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button 
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
              type="submit" 
              className="w-1/2"
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