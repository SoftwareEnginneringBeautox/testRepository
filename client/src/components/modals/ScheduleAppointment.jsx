import React, { useState } from "react";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import UserIcon from "@/assets/icons/UserIcon";
import EmailIcon from "@/assets/icons/EmailIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import AgeIcon from "@/assets/icons/AgeIcon";
import ArrowNorthEastIcon from "@/assets/icons/ArrowNorthEastIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

function ScheduleAppointmentModal({ isOpen, onClose }) {
  // Track input values
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfSession, setDateOfSession] = useState("");
  const [timeOfSession, setTimeOfSession] = useState("");

  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate timestamp for when the appointment is created
      const createdAt = new Date().toISOString();

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          contact_number: contactNumber,
          age: parseInt(age, 10),
          email: email,
          date_of_session: dateOfSession,
          time_of_session: timeOfSession,
          created_at: createdAt
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // On success, you can show a message, reset the form, or close the modal
        alert("Appointment scheduled successfully!");
        onClose();
      } else {
        // Handle a failed response
        alert(`Error scheduling appointment: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("An error occurred while scheduling the appointment.");
    }
  };

  return (
    <ModalContainer data-cy="schedule-appointment-modal">
      <ModalHeader>
        <ModalTitle data-cy="schedule-appointment-title">SCHEDULE APPOINTMENT</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} data-cy="schedule-appointment-form">
          {/* FULL NAME */}
          <InputContainer>
            <InputLabel>FULL NAME</InputLabel>
            <InputTextField>
              <InputIcon>
                <UserIcon />
              </InputIcon>
              <Input
                data-cy="schedule-fullname-input"
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </InputTextField>
          </InputContainer>

          {/* CONTACT NUMBER */}
          <InputContainer>
            <InputLabel>CONTACT NUMBER</InputLabel>
            <InputTextField>
              <InputIcon>
                <UserIDIcon />
              </InputIcon>
              <Input
                data-cy="schedule-contact-input"
                type="tel"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </InputTextField>
          </InputContainer>

          {/* AGE */}
          <InputContainer>
            <InputLabel>AGE</InputLabel>
            <InputTextField>
              <InputIcon>
                <AgeIcon />
              </InputIcon>
              <Input
                data-cy="schedule-age-input"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </InputTextField>
          </InputContainer>

          {/* EMAIL */}
          <InputContainer>
            <InputLabel>EMAIL</InputLabel>
            <InputTextField>
              <InputIcon>
                <EmailIcon />
              </InputIcon>
              <Input
                data-cy="schedule-email-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputTextField>
          </InputContainer>

          {/* DATE & TIME OF SESSION */}
          <div className="flex flex-row w-full gap-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  data-cy="schedule-date-input"
                  type="date"
                  placeholder="Date of Session"
                  value={dateOfSession}
                  onChange={(e) => setDateOfSession(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  data-cy="schedule-time-input"
                  type="time"
                  placeholder="Time of Session"
                  value={timeOfSession}
                  onChange={(e) => setTimeOfSession(e.target.value)}
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row gap-2 w-full" data-cy="schedule-appointment-actions">
            <Button
              data-cy="schedule-return-btn"
              variant="outline"
              fullWidth={true}
              type="button"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              RETURN
            </Button>
            <Button 
              data-cy="schedule-submit-btn"
              fullWidth={true} 
              type="submit"
            >
              <ArrowNorthEastIcon />
              SUBMIT SCHEDULE APPOINTMENT
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default ScheduleAppointmentModal;
