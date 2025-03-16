import React from "react";

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

import { ModalSelect, SelectItem } from "@/components/ui/Select";

import { Button } from "../ui/Button";

import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function CreateMonthlySales({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PesoIcon />
        </ModalIcon>
        <ModalTitle>CREATE MONTHLY EXPENSE ENTRY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>EXPENSE TYPE</InputLabel>

              <ModalSelect
                placeholder="Chosen treatment"
                icon={<ExpenseTypeIcon className="w-4 h-4" />}
              >
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
              </ModalSelect>
            </InputContainer>
            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CoinsIcon />
                </InputIcon>
                <Input
                  placeholder="Amount"
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d{0,2})?"
                  min="0"
                  step="0.01"
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2">
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
