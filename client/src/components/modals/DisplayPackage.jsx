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
        <ModalTitle>PACKAGE INFORMATION</ModalTitle>
        <button className="font-xl rotate-45 ml-auto" onClick={onClose}>
          <PlusIcon />
        </button>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-xl leading-8 font-semibold">
            PRODUCT ID:{" "}
            <span className="font-normal">{entryData.personInCharge}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            PACKAGE NAME:{" "}
            <span className="font-normal">{entryData.dateTransacted}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            LIST OF TREATMENTS:{" "}
            <span className="font-normal">{entryData.nextSessionTime}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            NUMBER OF SESSIONS:{" "}
            <span className="font-normal">{entryData.package}</span>
          </p>
          <p className="text-xl leading-8 font-semibold">
            TOTAL PRICE:PHP{" "}
            <span className="font-normal">{entryData.treatment}</span>
          </p>
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default DisplayEntry;
