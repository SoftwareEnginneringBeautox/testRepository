import React from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

function ArchiveStaff({ isOpen, onClose }) {
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
          <ArchiveIcon />
          REMOVE STAFF
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchiveStaff;
