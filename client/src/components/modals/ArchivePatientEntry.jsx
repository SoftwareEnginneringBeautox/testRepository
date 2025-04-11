import React, { useState } from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

function ArchivePatientEntry({ isOpen, onClose, onArchive }) {
  const [isArchiving, setIsArchiving] = useState(false);
  
  if (!isOpen) return null;

  const handleArchive = async () => {
    if (isArchiving) return;
    
    setIsArchiving(true);
    try {
      await onArchive();
    } catch (error) {
      console.error("Error archiving patient entry:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <ModalContainer className="flex flex-col gap-4">
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ARCHIVE PATIENT RECORD?</ModalTitle>
      <p className="dark:text-customNeutral-100">
        Deleting the chosen patient entry would mean there is no recovery for
        that entry.
      </p>
      <div className=" flex sm:flex-row flex-col gap-4 w-full">
        <Button 
          variant="outline" 
          className="md:w-1/2" 
          onClick={onClose}
          disabled={isArchiving}
        >
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button 
          className="md:w-1/2" 
          onClick={handleArchive}
          disabled={isArchiving}
        >
          <ArchiveIcon />
          {isArchiving ? "ARCHIVING..." : "ARCHIVE ENTRY"}
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ArchivePatientEntry;
