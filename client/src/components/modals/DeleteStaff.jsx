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
  ModalSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectIcon,
  SelectValue
} from "@/components/ui/select";

import DeleteIcon from "@/assets/icons/DeleteIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

function DeleteStaff({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="flex flex-col gap-4">
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">DELETE STAFF INFORMATION?</ModalTitle>
      <p>
        This will permanently delete the staff’s information from the system.
      </p>
      <div className=" flex flex-row gap-4 w-full">
        <Button variant="outline" className="w-1/2" onClick={onClose}>
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button className="w-1/2">
          <DeleteIcon />
          REMOVE STAFF
        </Button>
      </div>
    </ModalContainer>
  );
}

export default DeleteStaff;
