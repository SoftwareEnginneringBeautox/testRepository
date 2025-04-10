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

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CircleUserIcon from "@/assets/icons/CircleUserIcon";
import UserIcon from "@/assets/icons/UserIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import EditIcon from "@/assets/icons/EditIcon";
import AgeIcon from "@/assets/icons/AgeIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";

function EditPatientContactInfo({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  useEffect(() => {
    if (entryData) {
      const initial = {
        ...entryData,
        contact_number: entryData.contact_number || "",
        age: entryData.age || "",
        email: entryData.email || ""
      };

      setOriginalData(initial);
      setFormData(initial);
    }
  }, [entryData]);

  if (!isOpen) return null;

  return (
    <ModalContainer data-cy="edit-patient-contact-info-modal">
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon />
        </ModalIcon>
        <ModalTitle>EDIT PATIENT CONTACT INFORMATION</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <p>
              PATIENT RECORD OF{" "}
              {originalData.patient_name?.toUpperCase() || "UNKNOWN"}
            </p>

            {/* Display patient name but not editable */}
            <InputContainer>
              <InputLabel>PATIENT NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  data-cy="patient-name-input"
                  value={originalData.patient_name || ""}
                  readOnly
                />
              </InputTextField>
            </InputContainer>

            {/* CONTACT NUMBER - Editable */}
            <InputContainer>
              <InputLabel>CONTACT NUMBER</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PhoneIcon />
                </InputIcon>
                <Input
                  data-cy="contact-number-input"
                  placeholder="e.g. 09XXXXXXXXX"
                  value={formData.contact_number ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_number: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            {/* AGE - Editable */}
            <InputContainer>
              <InputLabel>AGE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <AgeIcon />
                </InputIcon>
                <Input
                  data-cy="age-input"
                  type="number"
                  min="0"
                  placeholder="Age"
                  value={formData.age ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            {/* EMAIL - Editable */}
            <InputContainer>
              <InputLabel>EMAIL</InputLabel>
              <InputTextField>
                <InputIcon>
                  <EmailIcon />
                </InputIcon>
                <Input
                  data-cy="email-input"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              type="button"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              type="button"
              className="md:w-1/2"
              onClick={() => {
                setFormSubmitAttempted(true);
                const errors = {};

                // Add any validation for contact fields if needed
                // For example, validate email format
                if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
                  errors.email = "Please enter a valid email address";
                }
                
                // Validate phone number format if needed
                if (formData.contact_number && !/^09\d{9}$/.test(formData.contact_number)) {
                  errors.contact_number = "Please enter a valid phone number (format: 09XXXXXXXXX)";
                }

                setFormErrors(errors);
                if (Object.keys(errors).length > 0) return;

                // Only submit the contact information fields
                const contactData = {
                  id: entryData.id,
                  contact_number: formData.contact_number || null,
                  age: formData.age || null,
                  email: formData.email || null
                };

                onSubmit(contactData);
              }}
            >
              <EditIcon />
              UPDATE CONTACT INFO
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditPatientContactInfo;