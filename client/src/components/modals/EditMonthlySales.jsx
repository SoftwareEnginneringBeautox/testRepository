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
import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";

function EditMonthlySales({ isOpen, onClose, onEditSuccess, initialData }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: ''
  });

  // Initialize form when modal opens or initialData changes
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
    // Convert amount to number before passing up
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
              <InputLabel>CATEGORY</InputLabel>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>DATE</InputLabel>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
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