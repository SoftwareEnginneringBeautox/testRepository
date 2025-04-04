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

function EditMonthlySales({ isOpen, onClose, onEditSuccess, initialData }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: ""
  });

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
    console.log("Form submitted with data:", formData);
    // Call the onEditSuccess function with the form data
    onEditSuccess({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PesoIcon />
        </ModalIcon>
        <ModalTitle>EDIT MONTHLY EXPENSE ENTRY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>CATEGORY</InputLabel>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData(prev => ({...prev, category: value}))
                }
              >
                <ModalSelectTrigger
                  icon={<ExpenseTypeIcon />}
                  placeholder="Select category"
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
              <EditIcon />
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditMonthlySales;