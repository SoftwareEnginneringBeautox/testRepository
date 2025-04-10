import React, { useState } from "react";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  AlertContainer,
  AlertText,
  AlertTitle,
  AlertDescription,
  CloseAlert
} from "@/components/ui/Alert";

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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  
  // Add validation error states
  const [ageError, setAgeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  if (!isOpen) return null;

  // Function to check if time is within business hours (12pm - 9pm)
  const isWithinBusinessHours = (time) => {
    if (!time) return false;

    const [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format for comparison
    // Business hours: 12:00 (12pm) to 21:00 (9pm)
    return (hours >= 12 && hours < 21) || (hours === 21 && minutes === 0);
  };

  // Function to validate phone number (Philippine format)
  const isValidPhoneNumber = (number) => {
    // Philippine format: 09XXXXXXXXX (11 digits starting with 09)
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(number);
  };

  // Function to validate if date is not in the past
  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for date comparison only
    return selectedDate >= today;
  };

  // Function to validate email
  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add validation handlers for each field
  const validateAge = (value) => {
    const ageValue = parseInt(value, 10);
    if (value && (isNaN(ageValue) || ageValue < 18)) {
      setAgeError(true);
      return false;
    } else {
      setAgeError(false);
      return true;
    }
  };
  
  const validatePhone = (value) => {
    if (value && !isValidPhoneNumber(value)) {
      setPhoneError(true);
      return false;
    } else {
      setPhoneError(false);
      return true;
    }
  };
  
  const validateDate = (value) => {
    if (value && !isValidDate(value)) {
      setDateError(true);
      return false;
    } else {
      setDateError(false);
      return true;
    }
  };

  const validateEmail = (value) => {
    if (value && !isValidEmail(value)) {
      setEmailError(true);
      return false;
    } else {
      setEmailError(false);
      return true;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset alert
    setAlertTitle("");
    setAlertMessage("");
    
    // Run all validations
    const isAgeValid = validateAge(age);
    const isPhoneValid = validatePhone(contactNumber);
    const isDateValid = validateDate(dateOfSession);
    const isTimeValid = isWithinBusinessHours(timeOfSession);
    const isEmailValid = validateEmail(email);
    
    // If any validation fails, prevent form submission
    if (!isAgeValid || !isPhoneValid || !isDateValid || !isTimeValid || !isEmailValid) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/staged-appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName,
          contact_number: contactNumber,
          age: parseInt(age, 10),
          email: email,
          date_of_session: dateOfSession,
          time_of_session: timeOfSession
        })
      });

      const data = await response.json();
      if (response.ok) {
        // On success, show alert instead of using native alert
        setAlertTitle("Success");
        setAlertMessage(
          "Appointment scheduled successfully! Awaiting confirmation."
        );
        setShowAlert(true);

        // We'll close the modal when the user dismisses the alert
      } else {
        // Handle a failed response
        setAlertTitle("Error");
        setAlertMessage(
          `Error scheduling appointment: ${data.error || data.message}`
        );
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setAlertTitle("Error");
      setAlertMessage("An error occurred while scheduling the appointment.");
      setShowAlert(true);
    }
  };

  // Handle alert dismissal
  const handleAlertClose = () => {
    setShowAlert(false);

    // If it was a success alert, also close the modal
    if (alertTitle === "Success") {
      onClose();
    }
  };

  return (
    <ModalContainer data-cy="schedule-appointment-modal">
      {showAlert && (
        <AlertContainer>
          <AlertText>
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </AlertText>
          <CloseAlert onClick={handleAlertClose} />
        </AlertContainer>
      )}
      <ModalHeader>
        <ModalTitle data-cy="schedule-appointment-title">
          SCHEDULE APPOINTMENT
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          data-cy="schedule-appointment-form"
        >
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
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  validatePhone(e.target.value);
                }}
                onBlur={(e) => validatePhone(e.target.value)}
                required
              />
            </InputTextField>
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid Philippine mobile number (format: 09XXXXXXXXX)
              </p>
            )}
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
                onChange={(e) => {
                  setAge(e.target.value);
                  validateAge(e.target.value);
                }}
                onBlur={(e) => validateAge(e.target.value)}
                required
              />
            </InputTextField>
            {ageError && (
              <p className="text-red-500 text-xs mt-1">
                You must be at least 18 years old to schedule an appointment
              </p>
            )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                required
              />
            </InputTextField>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid email address
              </p>
            )}
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
                  onChange={(e) => {
                    setDateOfSession(e.target.value);
                    validateDate(e.target.value);
                  }}
                  onBlur={(e) => validateDate(e.target.value)}
                  required
                />
              </InputTextField>
              {dateError && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a date that is not in the past
                </p>
              )}
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
                  onChange={(e) => {
                    setTimeOfSession(e.target.value);
                    // Clear alert if user changes the time
                    if (showAlert) setShowAlert(false);
                  }}
                  required
                />
              </InputTextField>
              {!isWithinBusinessHours(timeOfSession) && timeOfSession && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a time between 12:00 PM and 9:00 PM
                </p>
              )}
            </InputContainer>
          </div>

          {/* ACTION BUTTONS */}
          <div
            className="flex sm:flex-row flex-col gap-2 w-full"
            data-cy="schedule-appointment-actions"
          >
            <Button
              data-cy="schedule-return-btn"
              variant="outline"
              fullWidth={true}
              type="button"
              onClick={onClose}
              className="md:w-1/2"
            >
              <ChevronLeftIcon />
              RETURN
            </Button>
            <Button
              data-cy="schedule-submit-btn"
              fullWidth={true}
              type="submit"
              className="md:w-1/2"
            >
              <ArrowNorthEastIcon />
              SUBMIT APPOINTMENT
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default ScheduleAppointmentModal;
