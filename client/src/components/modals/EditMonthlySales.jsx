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
  ModalSelect,
  SelectItem
} from "@/components/ui/Input";
import { Button } from "../ui/Button";
import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function EditMonthlySales({ isOpen, onClose, onEditSuccess, initialData }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        category: initialData.category || '',
        date: initialData.date || ''
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditSuccess({
      ...formData,
      amount: parseFloat(formData.amount)
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
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CoinsIcon />
                </InputIcon>
                <input
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
              <InputLabel>CATEGORY</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleChange({ target: { name: "category", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
                </SelectContent>
              </Select>
            </InputContainer>

            <InputContainer>
              <InputLabel>DATE</InputLabel>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose} type="button">
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