import React from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";
import { Button } from "../ui/Button";

import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

function ArchiveStaff({ isOpen, onClose, onArchive }) {
  if (!isOpen) return null;

  return (
    <ModalContainer data-cy="archive-staff-modal" className="flex flex-col gap-4">
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ARCHIVE STAFF INFORMATION?</ModalTitle>
      <p>This will archive the staff’s information within the system.</p>
      <div className="flex flex-row gap-4 w-full">
        <Button data-cy="cancel-archive-staff" variant="outline" className="w-1/2" onClick={onClose}>
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button data-cy="confirm-archive-staff" className="w-1/2" onClick={onArchive}>
          <ArchiveIcon />
          ARCHIVE STAFF
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchiveStaff;
