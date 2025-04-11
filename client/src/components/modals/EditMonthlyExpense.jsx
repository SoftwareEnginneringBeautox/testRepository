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

import {
  Select,
  ModalSelectTrigger,
  ModalSelectContent,
  SelectItem
} from "@/components/ui/Select";

import { Button } from "../ui/Button";
import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function EditMonthlySales({
  isOpen,
  onClose,
  onEditSuccess,
  initialData,
  categories
}) {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      console.log("Setting form data with initialData:", initialData);
      setFormData({
        amount: initialData.amount?.toString() || "",
        category: initialData.category || "",
        date: initialData.date || ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    console.log("Form submitted with data:", formData);
    
    try {
      // Call the onEditSuccess function with the form data
      onEditSuccess({
        ...formData,
        amount: parseFloat(formData.amount) || 0
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer data-cy="edit-monthly-expense-modal">
      <ModalHeader>
        <ModalIcon>
          <PesoIcon />
        </ModalIcon>
        <ModalTitle data-cy="edit-expense-title">
          EDIT MONTHLY EXPENSE ENTRY
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} data-cy="edit-expense-form">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>CATEGORY</InputLabel>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                data-cy="expense-type-select"
              >
                <ModalSelectTrigger
                  icon={
                    <ExpenseTypeIcon className="dark:bg-customNeutral-100" />
                  }
                  placeholder="Select category"
                  data-cy="expense-type-trigger"
                />
                <ModalSelectContent>
                  {safeCategories.length > 0 ? (
                    safeCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        data-cy={`expense-type-option-${category.id}`}
                      >
                        {category.name.toUpperCase()}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      value=""
                      disabled
                      data-cy="no-categories-option"
                    >
                      No categories available
                    </SelectItem>
                  )}
                </ModalSelectContent>
              </Select>
            </InputContainer>

            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CoinsIcon />
                </InputIcon>
                <Input
                  data-cy="expense-amount-input"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  required
                  className="w-full bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>DATE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="expense-date-input"
                  name="date"
                  type="date"
                  placeholder="Date of Session"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="text-input"
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-edit-expense-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
              type="button"
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-edit-expense"
              className="md:w-1/2"
              type="submit"
              disabled={isSubmitting}
            >
              <EditIcon />
              {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditMonthlySales;
