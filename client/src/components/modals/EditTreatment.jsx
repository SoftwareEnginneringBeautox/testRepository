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
  Input,
  InputArea,
  InputAreaField
} from "@/components/ui/Input";

import { Button } from "../ui/Button";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import EditIcon from "@/assets/icons/EditIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import PesoIcon from "@/assets/icons/PesoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";

function EditTreatment({ isOpen, onClose, entryData, onSubmit }) {
  const [formData, setFormData] = useState({
    treatment_name: "",
    price: "",
    duration: "",
    expiration: ""
  });

  useEffect(() => {
    if (entryData) {
      setFormData({
        treatment_name: entryData.treatment_name || "",
        price: entryData.price || "",
        duration: entryData.duration || "",
        expiration: entryData.expiration || ""
      });
    }
  }, [entryData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!entryData?.id) {
      console.error("entryData is missing or invalid");
      return;
    }

    const cleanedData = { ...formData };
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === "") delete cleanedData[key];
    });

    onSubmit({ id: entryData.id, ...cleanedData });
  };

  return (
    <ModalContainer data-cy="edit-treatment-modal">
      <ModalHeader>
        <ModalIcon>
          <TreatmentIcon />
        </ModalIcon>
        <ModalTitle>EDIT TREATMENT</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={(e) => e.preventDefault()}
          data-cy="edit-treatment-form"
        >
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>TREATMENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <TreatmentIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-name"
                  placeholder="e.g. Diamond Peel Facial"
                  value={formData.treatment_name}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment_name: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>PRICE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PesoIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-price"
                  placeholder="₱"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
            <InputContainer>
              <InputLabel>DURATION (MINUTES)</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-duration"
                  placeholder="e.g. 45"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>EXPIRATION (IN WEEKS)</InputLabel>
              <InputTextField>
                <InputIcon>
                  <TreatmentIcon />
                </InputIcon>
                <Input
                  data-cy="treatment-expiration"
                  placeholder="e.g. 12"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.expiration}
                  onChange={(e) =>
                    setFormData({ ...formData, expiration: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-treatment-btn"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="save-treatment-btn"
              className="md:w-1/2"
              onClick={handleSubmit}
            >
              <EditIcon />
              EDIT TREATMENT
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditTreatment;
