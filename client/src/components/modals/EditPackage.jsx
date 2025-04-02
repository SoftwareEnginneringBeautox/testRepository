import React, { useState, useEffect } from "react";

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

import { SelectItem } from "@/components/ui/Select";

import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PackageIcon from "@/assets/icons/PackageIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import HashtagIcon from "@/assets/icons/HashtagIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import EditIcon from "@/assets/icons/EditIcon";

function EditPackage({ isOpen, onClose, entryData, onSubmit }) {
  const [formData, setFormData] = useState({
    package_name: "",
    treatment: "",
    sessions: "",
    price: ""
  });

  useEffect(() => {
    if (entryData) {
      setFormData({
        package_name: entryData.package_name || "",
        treatment: entryData.treatment || "",
        sessions: entryData.sessions || "",
        price: entryData.price || ""
      });
    }
  }, [entryData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!entryData?.id) {
      console.error("entryData is missing or invalid");
      return;
    }

    const cleanedData = { ...originalData, ...formData };
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === "") delete cleanedData[key];
    });

    onSubmit({ id: entryData.id, ...cleanedData });
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <PackageIcon />
        </ModalIcon>
        <ModalTitle>EDIT PACKAGE</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>PACKAGE NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  placeholder="Name of the Package"
                  value={formData.package_name}
                  onChange={(e) =>
                    setFormData({ ...formData, package_name: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
            <InputContainer>
              <InputLabel>TREATMENTS</InputLabel>

              <ModalSelect
                placeholder="Treatments chosen"
                icon={<TreatmentIcon className="w-4 h-4 " />}
                value={formData.treatment}
                onValueChange={(value) =>
                  setFormData({ ...formData, treatment: value })
                }
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
                  type="number"
                  value={formData.sessions}
                  onChange={(e) =>
                    setFormData({ ...formData, sessions: e.target.value })
                  }
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
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2" onClick={handleSubmit}>
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
