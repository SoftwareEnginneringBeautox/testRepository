import React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Checkbox } from "@/components/ui/checkbox";

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import { Button } from "../ui/Button";

import PesoIcon from "@/assets/icons/PesoIcon";
import CoinsIcon from "@/assets/icons/CoinsIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import CircleUserIcon from "@/assets/icons/PlusIcon";
import UserIcon from "@/assets/icons/UserIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import PercentageIcon from "@/assets/icons/PercentageIcon";

function CreatePatientEntry({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <UserIcon />
        </ModalIcon>
        <ModalTitle>CREATE PATIENT RECORD</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
          <div className="flex flex-col gap-4">
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
              <InputLabel>PACKAGE</InputLabel>

              <ModalSelect
                placeholder="Chosen package"
                icon={<PackageIcon className="w-4 h-4" />}
              >
                <SelectItem value="Package 1">Package 1</SelectItem>
                <SelectItem value="Package 2">Package 2</SelectItem>
                <SelectItem value="Package 3">Package 3</SelectItem>
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>TREATMENT</InputLabel>

              <ModalSelect
                placeholder="Chosen treatment"
                icon={<PackageIcon className="w-4 h-4" />}
              >
                <SelectItem value="Treatment 1">Treatment 1</SelectItem>
                <SelectItem value="Treatment 2">Treatment 2</SelectItem>
                <SelectItem value="Treatment 3">Treatment 3</SelectItem>
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>TOTAL AMOUNT</InputLabel>
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

            <InputContainer>
              <InputLabel>PACKAGE DISCOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PercentageIcon />
                </InputIcon>
                <Input
                  placeholder="Discount in percent"
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d{0,2})?"
                  min="0"
                  step="0.01"
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>AMOUNT</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  placeholder="Amount"
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d{0,2})?"
                  min="0"
                  step="0.01"
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div>
            <h5 className="text-xl leading-8">PAYMENT METHOD</h5>
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

          <div>
            <h5 className="text-xl leading-8">PATIENT CONSENT FORM</h5>
            <Checkbox id="cb1" />
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2">
              <PlusIcon />
              ADD ENTRY
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreatePatientEntry;
