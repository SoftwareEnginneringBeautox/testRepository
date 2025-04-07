import React from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import DeleteIcon from "@/assets/icons/DeleteIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

function DeleteMonthlySales({ isOpen, onClose, onArchive }) {
  if (!isOpen) return null;

  return (
    <ModalContainer
      data-cy="delete-monthly-expense-modal"
      className="flex flex-col gap-4"
    >
      <div
        data-cy="warning-icon-container"
        className="flex w-full flex-1 items-center justify-center text-warning-300"
      >
        <WarningIcon size={48} />
      </div>
      <ModalTitle data-cy="archive-expense-title" className="text-center">
        ARCHIVE MONTHLY EXPENSE?
      </ModalTitle>
      <p data-cy="archive-expense-description">
        This will archive the expense within the system.
      </p>
      <div
        data-cy="archive-expense-buttons"
        className=" flex sm:flex-row flex-col gap-4 w-full"
      >
        <Button
          data-cy="cancel-archive-expense-btn"
          variant="outline"
          className="md:w-1/2"
          onClick={onClose}
        >
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button
          data-cy="confirm-archive-expense-btn"
          className="md:w-1/2"
          onClick={onArchive}
        >
          <DeleteIcon />
          DELETE EXPENSE
        </Button>
      </div>
    </ModalContainer>
  );
}

export default DeleteMonthlySales;
