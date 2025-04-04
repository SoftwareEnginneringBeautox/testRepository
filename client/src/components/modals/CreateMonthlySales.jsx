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

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";


function CreateMonthlySales({ isOpen, onClose, onCreateSuccess }) {
  const [formData, setFormData] = useState({
    expenseType: "",
    amount: "",
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.expenseType || !formData.amount || !formData.date) {
      alert("Please fill in all required fields");
      return;
    }

    // Format data to match server expectations
    const formattedData = {
      category: formData.expenseType,
      expense: parseFloat(formData.amount),
      date: formData.date
    };

    console.log("Submitting expense data:", formattedData);

    // Call the callback with form data
    onCreateSuccess(formattedData);

    // Close the modal
    onClose();
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PesoIcon />
        </ModalIcon>
        <ModalTitle>CREATE MONTHLY EXPENSE ENTRY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>EXPENSE TYPE</InputLabel>

              <Select
                name="expenseType"
                value={formData.expenseType}
                onValueChange={handleExpenseTypeChange}
              >
                <ModalSelectTrigger
                  placeholder="Select expense type"
                  icon={<ExpenseTypeIcon className="w-4 h-4" />}
                />
                <ModalSelectContent>
                  <SelectItem value="DAILY EXPENSE">DAILY EXPENSE</SelectItem>
                  <SelectItem value="MONTHLY PURCHASE ORDER">
                    MONTHLY PURCHASE ORDER
                  </SelectItem>
                  <SelectItem value="SALARY">SALARY</SelectItem>
                  <SelectItem value="COMMISSIONS">COMMISSIONS</SelectItem>
                  <SelectItem value="ELECTRICITY">ELECTRICITY</SelectItem>
                  <SelectItem value="WATER">WATER</SelectItem>
                  <SelectItem value="ACCOUNTING/TAX">ACCOUNTING/TAX</SelectItem>
                  <SelectItem value="RENTAL">RENTAL</SelectItem>
                  <SelectItem value="BUSINESS PHONE">BUSINESS PHONE</SelectItem>
                  <SelectItem value="RENOVATIONS">RENOVATIONS</SelectItem>
                  <SelectItem value="INTERNET">INTERNET</SelectItem>
                  <SelectItem value="MARKETING TEAM">MARKETING TEAM</SelectItem>
                  <SelectItem value="SOCIAL MEDIA ADVERTISEMENTS">
                    SOCIAL MEDIA ADVERTISEMENTS
                  </SelectItem>
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
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={onClose}
              type="button"
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2" type="submit">
              <PlusIcon />
              ADD EXPENSE
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateMonthlySales;
