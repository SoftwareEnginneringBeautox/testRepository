import React from "react";

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

import { SelectItem, ModalSelect } from "@/components/ui/select";

import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import HashtagIcon from "@/assets/icons/HashtagIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import EditIcon from "@/assets/icons/EditIcon";

function EditPackage({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PackageIcon />
        </ModalIcon>
        <ModalTitle>EDIT PACKAGE</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>PACKAGE NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input placeholder="Name of the Package" />
              </InputTextField>
            </InputContainer>
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>

              <ModalSelect
                placeholder="Treatments chosen"
                icon={<TreatmentIcon className="w-4 h-4 " />}
              >
                <SelectItem value="AESTHETICIAN">AESTHETICIAN</SelectItem>
                <SelectItem value="RECEPTIONIST">RECEPTIONIST</SelectItem>
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>NUMBER OF TREATMENTS</InputLabel>
              <InputTextField>
                <InputIcon>
                  <HashtagIcon />
                </InputIcon>
                <Input
                  placeholder="Number of treatments to be taken"
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
                  placeholder="Total amount to pay"
                  type="text"
                  inputMode="decimal"
                  pattern="\\d+(\\.\\d{0,2})?"
                  min="0"
                  step="0.01"
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2">
              <EditIcon />
              EDIT PACKAGE
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditPackage;
