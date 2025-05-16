import React, { useState } from "react";

import { ModalContainer, ModalTitle } from "@/components/ui/Modal";

import { Button } from "../ui/Button";

import WarningIcon from "@/assets/icons/WarningIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

function ConfirmParentalConsent({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <ModalContainer
      data-cy="confirm-parental-consent-modal"
      className="flex flex-col gap-4"
    >
      <div className="flex w-full flex-1 items-center justify-center text-warning-300">
        <WarningIcon size={48} />
      </div>
      <ModalTitle className="text-center">ALLOW PARENTAL CONSENT?</ModalTitle>
      <p className="dark:text-customNeutral-100">
        Patient is below 18 years old. Is this a parental consent provided for
        treatment?
      </p>
      <div className="flex sm:flex-row flex-col gap-4 w-full">
        <Button
          data-cy="cancel-consent-btn"
          variant="outline"
          className="md:w-1/2"
          onClick={onClose}
        >
          <ChevronLeftIcon />
          CANCEL AND RETURN
        </Button>
        <Button
          data-cy="confirm-consent-btn"
          className="md:w-1/2 truncate"
          onClick={onConfirm}
        >
          CONFIRM AND ALLOW
          <ChevronRightIcon />
        </Button>
      </div>
    </ModalContainer>
  );
}

export default ConfirmParentalConsent;
