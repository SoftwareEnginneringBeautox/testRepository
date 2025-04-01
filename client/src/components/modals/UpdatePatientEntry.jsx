import React, { useState, useEffect } from "react";

import { Checkbox } from "@/components/ui/Checkbox";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

//import { ModalSelect, SelectItem } from "../ui/Select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectIcon,
} from "@/components/ui/Select";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserIcon from "@/assets/icons/UserIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import EditIcon from "@/assets/icons/EditIcon";

function UpdatePatientEntry({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});

  /*const [formData, setFormData] = useState({
    patient_name: "",
    person_in_charge: "",
    treatment: "",
    total_amount: "",
    payment_method: "",
    date_of_session: "",
    time_of_session: "",
    consent_form_signed: false
  });*/
  
  useEffect(() => {
    if (entryData) {
      /*setFormData({
        patient_name: entryData.patient_name || "",
        person_in_charge: entryData.person_in_charge || "",
        treatment: entryData.treatment || "",
        total_amount: entryData.total_amount || "",
        payment_method: entryData.payment_method || "",
        date_of_session: entryData.date_of_session || "",
        time_of_session: entryData.time_of_session || "",
        consent_form_signed: entryData.consent_form_signed || false
      });*/
      setOriginalData(entryData);
      setFormData({});
    }
  }, [entryData]);
  

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon />
        </ModalIcon>
        <ModalTitle>UPDATE PATIENT RECORD</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <p>{originalData.patient_name?.toUpperCase() || "UNKNOWN"}'S PATIENT RECORD</p>
            <p>
              <span>CURRENT PACKAGE</span> {entryData?.package_name?.toUpperCase() || "N/A"}
            </p>
            <InputContainer>
              <InputLabel>PATIENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input placeholder={originalData.patient_name || "Full name of the patient"}
                 value={formData.patient_name ?? ""}
                 onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                 />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>PERSON IN CHARGE</InputLabel>

              <Select
                value={formData.person_in_charge ?? originalData.person_in_charge}
                onValueChange={(value) =>
                  setFormData({ ...formData, person_in_charge: value })
                }
              >
                <SelectTrigger>
                  <UserIDIcon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Person in charge of the session" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jessica">Jessica</SelectItem>
                  <SelectItem value="Jimmy">Jimmy</SelectItem>
                </SelectContent>
              </Select>

            </InputContainer>

            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>

              <Select
                value={formData.treatment ?? originalData.treatment}
                onValueChange={(value) =>
                  setFormData({ ...formData, treatment: value })
                }
              >
                <SelectTrigger>
                  <TreatmentIcon className="w-4 h-4" />
                  <SelectValue placeholder="Chosen treatment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Treatment 1">Treatment 1</SelectItem>
                  <SelectItem value="Treatment 2">Treatment 2</SelectItem>
                  <SelectItem value="Treatment 3">Treatment 3</SelectItem>
                </SelectContent>
              </Select>


            </InputContainer>

            <h5 className="my-4 font-semibold">
              TOTAL AMOUNT <span>
                ₱
                {formData.total_amount ??
                  originalData.total_amount ??
                  "0.00"}
              </span>

            </h5>

            <InputContainer>
              <InputLabel>AMOUNT PAID</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  placeholder="Total Amount to Pay"
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d{0,2})?"
                  min="0"
                  step="0.01"
                  value={formData.total_amount ?? originalData.total_amount ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, total_amount: e.target.value })
                  } 
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
            <InputLabel>PAYMENT METHOD</InputLabel>
            <Select
              value={formData.payment_method ?? originalData.payment_method}
              onValueChange={(value) =>
                setFormData({ ...formData, payment_method: value })
              }
            >
              <SelectTrigger>
                <PesoIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select payment method" />
                <SelectIcon />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="GCash">GCash</SelectItem>
              </SelectContent>
            </Select>

          </InputContainer>

          </div>

          <div className="flex flex-row w-full gap-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  type="date"
                  className="text-input"
                  placeholder="Date of Session"
                  required
                  value={formData.date_of_session ?? originalData.date_of_session ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_session: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  type="time"
                  className="text-input"
                  required
                  value={formData.time_of_session ?? originalData.time_of_session ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, time_of_session: e.target.value })
                  }
                />

              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <Select
                value={formData.next_treatment ?? originalData.next_treatment}
                onValueChange={(value) =>
                  setFormData({ ...formData, next_treatment: value })
                }
              >
                <SelectTrigger>
                  <TreatmentIcon className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Next treatment chosen" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AESTHETICIAN">AESTHETICIAN</SelectItem>
                  <SelectItem value="RECEPTIONIST">RECEPTIONIST</SelectItem>
                </SelectContent>
              </Select>

            </InputContainer>
          </div>

          <div className="flex flex-col gap-4 my-4">
            <h5 className="text-xl leading-8 font-semibold">
              PATIENT CONSENT FORM
            </h5>
            <div className="flex flex-row gap-3 items-center justify-start">
              <Checkbox id="consent" 
              checked={formData.consent_form_signed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, consent_form_signed: checked })
              }
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button type="button" variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              type="button"
              className="w-1/2"
              onClick={() => {
                const cleanedData = { ...originalData, ...formData };
                Object.keys(cleanedData).forEach((key) => {
                  if (cleanedData[key] === "") delete cleanedData[key];
                });
                onSubmit({ id: entryData.id, ...cleanedData });
              }}
            >
              <EditIcon />
              UPDATE ENTRY
            </Button>

          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default UpdatePatientEntry;