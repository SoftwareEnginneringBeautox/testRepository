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

import {
  Select,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  ModalSelect
} from "@/components/ui/select";

import UserIDIcon from "@/assets/icons/UserIDIcon";
import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function CreateNewStaff({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <UserIDIcon />
        </ModalIcon>
        <ModalTitle>CREATE NEW STAFF</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>STAFF NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input placeholder="Name of the Staff" />
              </InputTextField>
            </InputContainer>
            <InputContainer>
              <InputLabel>STAFF ROLE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIDIcon />
                </InputIcon>
                <Input placeholder="Role of the Staff" />
              </InputTextField>
            </InputContainer>
            <InputContainer>
              <InputLabel>DESIGNATED DAY OFF</InputLabel>
              <ModalSelect placeholder="Select an option">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </ModalSelect>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2">
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2">
              <PlusIcon />
              CREATE STAFF
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateNewStaff;
