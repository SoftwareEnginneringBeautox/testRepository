import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (formData.contact_number && !/^09\d{9}$/.test(formData.contact_number)) {
      errors.contact_number = "Please enter a valid phone number (format: 09XXXXXXXXX)";
    }

    // Age validation
    if (formData.age) {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18) {
        errors.age = "Patients must be at least 18 years old";
      } else if (ageNum > 120) {
        errors.age = "Age must be less than 120";
      }
    }

    return errors;
  };

  // New function to update appointment records with new contact information
  const updateAppointmentRecords = async (patientData) => {
    try {
      // Fetch appointments with this patient_record_id
      const response = await axios.get(`${API_BASE_URL}/api/appointments`, {
        withCredentials: true
      });
      
      const patientAppointments = response.data.filter(
        appointment => appointment.patient_record_id === patientData.id
      );
      
      // If no appointments exist, we're done
      if (patientAppointments.length === 0) {
        console.log("No appointments found for this patient record");
        return;
      }
      
      // For each appointment, update the contact information while preserving scheduling data
      for (const appointment of patientAppointments) {
        // Prepare appointment update payload
        const appointmentPayload = {
          table: 'appointments',
          id: appointment.id,
          action: 'edit',
          data: {
            full_name: entryData.patient_name, // Keep original patient name
            contact_number: patientData.contact_number,
            age: patientData.age,
            email: patientData.email,
            patient_record_id: patientData.id
            // Intentionally not including date_of_session and time_of_session to preserve them
          }
        };
        
        // Update the appointment record
        await axios.post(
          `${API_BASE_URL}/api/manage-record`, 
          appointmentPayload,
          { withCredentials: true }
        );
        
        console.log(`✅ Updated appointment ID ${appointment.id} with new contact info`);
      }
      
      return patientAppointments.length;
    } catch (error) {
      console.error("Error updating appointment records:", error);
      throw error; // Re-throw for handling in the main submission function
    }
  };

  const handleSubmit = async () => {
    setFormSubmitAttempted(true);
    setIsSubmitting(true);
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    // Check if any changes were made
    if (
      formData.contact_number === originalData.contact_number &&
      formData.age === originalData.age &&
      formData.email === originalData.email
    ) {
      // No changes made, close modal
      setIsSubmitting(false);
      onClose();
      return;
    }

    // Only submit the contact information fields
    const contactData = {
      id: entryData.id,
      contact_number: formData.contact_number || null,
      age: formData.age ? parseInt(formData.age) : null,
      email: formData.email || null
    };

    try {
      // First, update the patient record
      await onSubmit(contactData);
      
      // Second, update any associated appointment records
      const updatedAppointments = await updateAppointmentRecords(contactData);
      
      // Log success if appointments were updated
      if (updatedAppointments) {
        console.log(`Successfully updated ${updatedAppointments} appointment records`);
      }
      
      setIsSubmitting(false);
      // Success - modal will be closed by parent component
    } catch (error) {
      console.error("Error updating contact info:", error);
      setIsSubmitting(false);
      // Could add error handling here
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer data-cy="edit-patient-contact-info-modal">
      <ModalHeader>
        <ModalIcon>
          <CircleUserIcon />
        </ModalIcon>
        <ModalTitle>EDIT PATIENT RECORD</ModalTitle>
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
                  className={formErrors.contact_number ? "border-red-500" : ""}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.contact_number && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.contact_number}
                </p>
              )}
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
                  min="18"
                  placeholder="Age"
                  value={formData.age ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className={formErrors.age ? "border-red-500" : ""}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.age}
                </p>
              )}
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
                  className={formErrors.email ? "border-red-500" : ""}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email}
                </p>
              )}
            </InputContainer>
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              type="button"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              type="button"
              className="md:w-1/2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <EditIcon />
              {isSubmitting ? "SAVING..." : "EDIT CONTACT INFO"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default EditPatientContactInfo;