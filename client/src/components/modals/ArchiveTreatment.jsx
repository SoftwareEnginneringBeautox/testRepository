import React, { useState } from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

function ArchiveTreatment({ isOpen, onClose, onArchive }) {
  const [isArchiving, setIsArchiving] = useState(false);
  
  if (!isOpen) return null;

  const handleArchive = async () => {
    if (isArchiving) return;
    
    setIsArchiving(true);
    try {
      await onArchive();
    } catch (error) {
      console.error("Error archiving treatment:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <ModalContainer
      data-cy="archive-treatment-modal"
      className="flex flex-col gap-4"
    >
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">
        ARCHIVE TREATMENT INFORMATION?
      </ModalTitle>
      <p className="dark:text-customNeutral-100">
        This will archive the treatment’s information within the system.
      </p>
      <div className="flex sm:flex-row flex-col gap-4 w-full">
        <Button
          data-cy="cancel-archive-btn"
          variant="outline"
          className="md:w-1/2"
          onClick={onClose}
          disabled={isArchiving}
        >
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button
          data-cy="confirm-archive-btn"
          className="md:w-1/2"
          onClick={handleArchive}
          disabled={isArchiving}
        >
          <ArchiveIcon />
          {isArchiving ? "ARCHIVING..." : "ARCHIVE TREATMENT"}
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchiveTreatment;
