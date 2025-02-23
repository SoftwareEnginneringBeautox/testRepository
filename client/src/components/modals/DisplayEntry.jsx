import React from "react";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import PlusIcon from "@/assets/icons/PlusIcon";

function DisplayEntry({ isOpen, onClose, entryData }) {
  if (!isOpen || !entryData) return null;

  return (
    <ModalContainer>
      <ModalHeader className="flex items-center">
        <ModalIcon>
          <CircleUserIcon className="text-reflexBlue-400" />
        </ModalIcon>
        <ModalTitle>{entryData.client.toUpperCase()}'S PACKAGE</ModalTitle>
        <button className="font-xl rotate-45 ml-auto" onClick={onClose}>
          <PlusIcon />
        </button>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-xl leading-8 font-semibold">
            PERSON IN CHARGE:{" "}
            <span className="font-normal">{entryData.personInCharge}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            DATE OF INITIAL SESSION:{" "}
            <span className="font-normal">{entryData.dateTransacted}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            TIME OF NEXT SESSION:{" "}
            <span className="font-normal">{entryData.nextSessionTime}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            PACKAGE: <span className="font-normal">{entryData.package}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            TREATMENT:{" "}
            <span className="font-normal">{entryData.treatment}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            PAYMENT METHOD:{" "}
            <span className="font-normal">{entryData.paymentMethod}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            AMOUNT PAID:{" "}
            <span className="font-normal">PHP {entryData.amountPaid}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            REMAINING BALANCE:{" "}
            <span className="font-normal">
              PHP {entryData.remainingBalance}
            </span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            PACKAGE DISCOUNT: <span className="font-normal">-</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            TOTAL PACKAGE COST:{" "}
            <span className="font-normal">PHP {entryData.totalAmount}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            CONSENT STATUS:{" "}
            <span className="font-normal">{entryData.consentStatus}</span>
          </p>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default DisplayEntry;
