import React from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

function ArchiveCategory({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer className="flex flex-col gap-4">
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ARCHIVE CATEGORY?</ModalTitle>
      <p>This will archive the expense category from the database.</p>
      <div className=" flex flex-row gap-4 w-full">
        <Button variant="outline" className="w-1/2" onClick={onClose}>
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button className="w-1/2">
          <ArchiveIcon />
          ARCHIVE CATEGORY
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchiveCategory;
