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

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import ExpenseTypeIcon from "@/assets/icons/ExpenseTypeIcon";

function CreateCategory({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <ExpenseTypeIcon />
        </ModalIcon>
        <ModalTitle>CREATE EXPENSE CATEGORY</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
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
                  required
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
              ADD CATEGORY
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateCategory;
