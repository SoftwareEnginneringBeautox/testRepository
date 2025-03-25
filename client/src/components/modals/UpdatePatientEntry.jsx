import React from "react";

import { Checkbox } from "@/components/ui/Checkbox";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

import { ModalSelect, SelectItem } from "../ui/Select";

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

function UpdatePatientEntry({ isOpen, onClose }) {
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
        <form action="">
          <div className="flex flex-col gap-4">
            <p>[NAME HERE]'S PATIENT RECORD</p>
            <p>
              <span>CURRENT PACKAGE</span> [PACKAGE CHOSEN HERE]
            </p>
            <InputContainer>
              <InputLabel>PATIENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input placeholder="Full name of the patient" />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>PERSON IN CHARGE</InputLabel>

              <ModalSelect
                placeholder="Person in charge of the session"
                icon={<UserIDIcon className="w-4 h-4" />}
              >
                <SelectItem value="Jessica">Jessica</SelectItem>
                <SelectItem value="Jimmy">Jimmy</SelectItem>
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>

              <ModalSelect
                placeholder="Chosen treatment"
                icon={<TreatmentIcon className="w-4 h-4" />}
              >
                <SelectItem value="Treatment 1">Treatment 1</SelectItem>
                <SelectItem value="Treatment 2">Treatment 2</SelectItem>
                <SelectItem value="Treatment 3">Treatment 3</SelectItem>
              </ModalSelect>
            </InputContainer>

            <h5 className="my-4 font-semibold">
              TOTAL AMOUNT <span>[amount here]</span>
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
                />
              </InputTextField>
            </InputContainer>

            <h5 className="my-4 font-semibold">
              PAYMENT METHOD <span>[amount here]</span>
            </h5>
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
                  placeholder="e.g. john_doe123"
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>
              <ModalSelect
                placeholder="Next treatment chosen"
                icon={<TreatmentIcon className="w-4 h-4 " />}
              >
                <SelectItem value="AESTHETICIAN">AESTHETICIAN</SelectItem>
                <SelectItem value="RECEPTIONIST">RECEPTIONIST</SelectItem>
              </ModalSelect>
            </InputContainer>
          </div>

          <div className="flex flex-col gap-4 my-4">
            <h5 className="text-xl leading-8 font-semibold">
              PATIENT CONSENT FORM
            </h5>
            <div className="flex flex-row gap-3 items-center justify-start">
              <Checkbox id="consent" />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2">
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
