import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ConfirmParentalConsent from "./ConfirmParentalConsent";

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
import CalendarIcon from "@/assets/icons/CalendarIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";

function EditPatientContactInfo({ isOpen, onClose, entryData, onSubmit }) {
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInProgressRef = useRef(false);
  const [showParentalConsentModal, setShowParentalConsentModal] =
    useState(false);

  useEffect(() => {
    if (entryData) {
      const initial = {
        ...entryData,
        contact_number: entryData.contact_number || "",
        birth_date: entryData?.birth_date || "",
        email: entryData.email || ""
      };

      setOriginalData(initial);
      setFormData(initial);
    }
  }, [entryData]);

  useEffect(() => {
    // Reset submission status when modal opens/closes
    return () => {
      submitInProgressRef.current = false;
      setIsSubmitting(false);
    };
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (formData.contact_number && !/^09\d{9}$/.test(formData.contact_number)) {
      errors.contact_number =
        "Please enter a valid phone number (format: 09XXXXXXXXX)";
    }

    // Birth date validation
    if (formData.birth_date) {
      const age = calculateAge(formData.birth_date);
      // Age 12 and below not allowed
      if (age <= 12) {
        errors.birth_date = "Patient must be over 12 years old";
      } else if (age > 120) {
        errors.birth_date = "Invalid birth date";
      }
      // Ages 13-17 will need parental consent (handled separately)
    }

    return errors;
  };

  // Add calculateAge helper function
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // New function to update appointment records with new contact information
  const updateAppointmentRecords = async (patientData) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments`, {
        withCredentials: true
      });

      const patientAppointments = response.data.filter(
        (appointment) => appointment.patient_record_id === patientData.id
      );

      if (patientAppointments.length === 0) {
        console.log("No appointments found for this patient record");
        return;
      }

      for (const appointment of patientAppointments) {
        const appointmentPayload = {
          table: "appointments",
          id: appointment.id,
          action: "edit",
          data: {
            full_name: entryData.patient_name,
            contact_number: patientData.contact_number,
            birth_date: patientData.birth_date,
            age: patientData.age,
            email: patientData.email,
            patient_record_id: patientData.id
          }
        };

        await axios.post(
          `${API_BASE_URL}/api/manage-record`,
          appointmentPayload,
          { withCredentials: true }
        );

        console.log(
          `✅ Updated appointment ID ${appointment.id} with new contact info`
        );
      }

      return patientAppointments.length;
    } catch (error) {
      console.error("Error updating appointment records:", error);
      throw error;
    }
  };

  // Main submission function
  const submitForm = async () => {
    // Prepare contact data with calculated age
    const contactData = {
      id: entryData.id,
      contact_number: formData.contact_number || null,
      birth_date: formData.birth_date || null,
      age: formData.birth_date ? calculateAge(formData.birth_date) : null,
      email: formData.email || null
    };

    try {
      // Update patient record
      await onSubmit(contactData);

      // Update appointment records
      const updatedAppointments = await updateAppointmentRecords(contactData);

      if (updatedAppointments) {
        console.log(
          `Successfully updated ${updatedAppointments} appointment records`
        );
      }

      setIsSubmitting(false);
      submitInProgressRef.current = false;
      onClose();
    } catch (error) {
      console.error("Error updating contact info:", error);
      setIsSubmitting(false);
      submitInProgressRef.current = false;
    }
  };

  // Handle parental consent confirmation
  const handleParentalConsentConfirm = () => {
    setShowParentalConsentModal(false);
    // Proceed with form submission
    submitForm();
  };

  const handleSubmit = async () => {
    if (isSubmitting || submitInProgressRef.current) {
      console.log("Submission already in progress");
      return;
    }

    submitInProgressRef.current = true;
    setFormSubmitAttempted(true);
    setIsSubmitting(true);

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      submitInProgressRef.current = false;
      return;
    }

    // Check if any changes were made
    if (
      formData.contact_number === originalData.contact_number &&
      formData.birth_date === originalData.birth_date &&
      formData.email === originalData.email
    ) {
      setIsSubmitting(false);
      submitInProgressRef.current = false;
      onClose();
      return;
    }

    // Check for underage patients (13-17)
    if (formData.birth_date) {
      const age = calculateAge(formData.birth_date);
      if (age >= 13 && age < 18) {
        // Show parental consent modal instead of proceeding
        setShowParentalConsentModal(true);
        setIsSubmitting(false);
        submitInProgressRef.current = false;
        return;
      }
    }

    // If no issues, proceed with form submission
    await submitForm();
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
                  maxLength={11}
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
              <InputLabel>BIRTH DATE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="birth-date-input"
                  type="date"
                  placeholder="Birth Date"
                  value={formData.birth_date ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className={formErrors.birth_date ? "border-red-500" : ""}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.birth_date && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.birth_date}
                </p>
              )}
              {formData.birth_date && !formErrors.birth_date && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Age: {calculateAge(formData.birth_date)} years old
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
                  maxLength={100}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={formErrors.email ? "border-red-500" : ""}
                />
              </InputTextField>
              {formSubmitAttempted && formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
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

      {/* Parental Consent Modal */}
      <ConfirmParentalConsent
        isOpen={showParentalConsentModal}
        onClose={() => setShowParentalConsentModal(false)}
        onConfirm={handleParentalConsentConfirm}
      />
    </ModalContainer>
  );
}

export default EditPatientContactInfo;
