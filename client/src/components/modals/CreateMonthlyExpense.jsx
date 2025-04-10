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

import {
  Select,
  ModalSelectTrigger,
  ModalSelectContent,
  SelectItem
} from "@/components/ui/Select";

import {
  AlertContainer,
  AlertText,
  AlertTitle,
  AlertDescription,
  CloseAlert
} from "@/components/ui/Alert";

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function CreateMonthlyExpense({
  isOpen,
  onClose,
  onCreateSuccess,
  categories
}) {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [formData, setFormData] = useState({
    expenseType: "",
    amount: "",
    date: new Date().toISOString().split("T")[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  if (!isOpen) return null;

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpenseTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      expenseType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.expenseType || !formData.amount || !formData.date) {
      setAlertTitle("Error");
      setAlertMessage("Please fill in all required fields");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data to match server expectations
      const formattedData = {
        category: formData.expenseType,
        expense: parseFloat(formData.amount),
        date: formData.date
      };

      console.log("Submitting expense data:", formattedData);

      // Call the callback with form data
      if (onCreateSuccess) {
        await onCreateSuccess(formattedData);
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating expense:", error);
      setAlertTitle("Error");
      setAlertMessage(
        "An error occurred while creating the expense. Please try again."
      );
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer data-cy="create-monthly-expense-modal">
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
          <PesoIcon size={28} />
        </ModalIcon>
        <ModalTitle>CREATE MONTHLY EXPENSE ENTRY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} data-cy="create-expense-form">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>EXPENSE TYPE</InputLabel>

              <Select
                name="expenseType"
                value={formData.expenseType}
                onValueChange={handleExpenseTypeChange}
                data-cy="expense-type-select"
              >
                <ModalSelectTrigger
                  data-cy="expense-type-trigger"
                  placeholder="Select expense type"
                  icon={<ExpenseTypeIcon className="w-4 h-4" />}
                />
                <ModalSelectContent>
                  {safeCategories.length > 0 ? (
                    safeCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name || `category-${category.id}`}
                        data-cy={`expense-type-option-${category.id}`}
                      >
                        {category.name.toUpperCase() || `Category ${category.id}`}
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
                  step="0.01"
                  required
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
                  placeholder="Date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="text-input"
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-expense-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-create-expense"
              className="md:w-1/2"
              type="submit"
              disabled={isSubmitting}
            >
              <PlusIcon />
              {isSubmitting ? "ADDING..." : "ADD EXPENSE"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateMonthlyExpense;
