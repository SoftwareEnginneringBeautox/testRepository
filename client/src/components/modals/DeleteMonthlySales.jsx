import React from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import DeleteIcon from "@/assets/icons/DeleteIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

function DeleteMonthlySales({ isOpen, onClose, onArchive }) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="flex flex-col gap-4">
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ARCHIVE MONTHLY EXPENSE?</ModalTitle>
      <p>This will archive the expense within the system.</p>
      <div className=" flex flex-row gap-4 w-full">
        <Button variant="outline" className="w-1/2" onClick={onClose}>
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button className="w-1/2" onClick={onArchive}>
          <DeleteIcon />
          DELETE EXPENSE
        </Button>
      </div>
    </ModalContainer>
  );
}

export default DeleteMonthlySales;
