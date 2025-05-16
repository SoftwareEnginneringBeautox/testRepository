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
        <ModalTitle>
          {entryData.client
            ? entryData.full_name.toUpperCase() + "'S PACKAGE"
            : "CLIENT'S PACKAGE"}
        </ModalTitle>
        <button className="font-xl rotate-45 ml-auto" onClick={onClose}>
          <PlusIcon />
        </button>
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          {[
            { label: "PERSON IN CHARGE", value: entryData.personInCharge },
            {
              label: "DATE OF SESSION",
              value: entryData.day
            },
            { label: "TIME OF SESSION", value: entryData.startTime },
            { label: "PACKAGE", value: entryData.packageName },
            { 
              label: "TREATMENT", 
              value: Array.isArray(entryData.treatmentIds) 
                ? entryData.treatmentNames || entryData.treatmentIds.map(id => {
                    // Try to find treatment name from various possible sources in entryData
                    if (entryData.treatments) {
                      const treatment = entryData.treatments.find(t => t.id === id);
                      return treatment ? treatment.treatment_name : id;
                    }
                    return id;
                  }).join(", ")
                : entryData.treatment || "N/A"
            },
            { label: "PAYMENT METHOD", value: entryData.paymentMethod },
            { label: "AMOUNT PAID", value: `PHP ${entryData.amountPaid}` },
            {
              label: "REMAINING BALANCE",
              value: `PHP ${entryData.remainingBalance}`
            },
            {
              label: "TOTAL PACKAGE COST",
              value: `PHP ${entryData.totalAmount}`
            },
            {
              label: "CONSENT STATUS", 
              value: entryData.consentFormSigned === true ? "YES" : 
                     entryData.consentFormSigned === false ? "NO" : "N/A"
            }
          ].map(({ label, value }) => (
            <p key={label} className="text-xl leading-8 font-semibold">
              {label}: <span className="font-normal">{value || "N/A"}</span>
            </p>
          ))}
        </div>
      </ModalBody>
    </ModalContainer>
  );
}

export default DisplayEntry;