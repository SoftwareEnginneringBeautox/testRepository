import React, { useState } from "react";
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

import {
  Select,
  ModalSelectTrigger,
  ModalSelectContent,
  SelectItem
} from "@/components/ui/Select";

import { Button } from "../ui/Button";

import UserIDIcon from "@/assets/icons/UserIDIcon";
import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import PasswordIcon from "@/assets/icons/PasswordIcon";
import EmailIcon from "@/assets/icons/EmailIcon";

function CreateStaff({ isOpen, onClose }) {
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [dayOff, setDayOff] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return ""; // Empty string means no error
  };

  // Check if username or email already exists
  const checkDuplicate = async (field, value) => {
    if (!value) return false;
    
    setValidating(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/check-duplicate`, {
        params: { field, value },
        withCredentials: true
      });
      
      return response.data.exists;
    } catch (err) {
      console.error(`Error checking duplicate ${field}:`, err);
      return false; // Assume no duplicate if the check fails
    } finally {
      setValidating(false);
    }
  };

  // Validate username when user finishes typing
  const validateUsername = async (name) => {
    if (!name) {
      setNameError("Username is required");
      return;
    }
    
    try {
      const isDuplicate = await checkDuplicate('username', name);
      if (isDuplicate) {
        setNameError("This username is already taken");
      } else {
        setNameError("");
      }
    } catch (err) {
      console.error("Error validating username:", err);
    }
  };

  // Validate email when user finishes typing
  const validateEmailWithServer = async (email) => {
    const formatError = validateEmail(email);
    if (formatError) {
      setEmailError(formatError);
      return;
    }
    
    try {
      const isDuplicate = await checkDuplicate('email', email);
      if (isDuplicate) {
        setEmailError("This email is already in use");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error("Error validating email:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (loading || validating) {
      console.log("Staff creation already in progress or validation in progress");
      return;
    }
    
    setLoading(true);
    setError("");

    // Validate inputs
    if (!staffName || !staffEmail || !staffRole || !staffPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    
    // Validate email specifically
    const emailError = validateEmail(staffEmail);
    if (emailError) {
      setEmailError(emailError);
      setLoading(false);
      return;
    }

    // Check for duplicate username and email before submission
    try {
      const [isDuplicateUsername, isDuplicateEmail] = await Promise.all([
        checkDuplicate('username', staffName),
        checkDuplicate('email', staffEmail)
      ]);
      
      if (isDuplicateUsername) {
        setNameError("This username is already taken");
        setLoading(false);
        return;
      }
      
      if (isDuplicateEmail) {
        setEmailError("This email is already in use");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error checking duplicates:", err);
      // Continue with submission if duplicate checks fail
    }

    console.log("Submitting staff creation request");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await axios.post(
        `${API_BASE_URL}/adduser`,
        {
          username: staffName,
          password: staffPassword,
          email: staffEmail,
          role: staffRole,
          dayoff: dayOff
        },
        { 
          withCredentials: true,
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (response.data.success) {
        console.log("Staff created successfully");
        onClose();
      } else {
        // Handle specific error messages from server
        if (response.data.message?.toLowerCase().includes("email")) {
          setEmailError(response.data.message || "Email error. The email may already be in use.");
        } else if (response.data.message?.toLowerCase().includes("username")) {
          setNameError(response.data.message || "This username is already taken.");
        } else {
          setError(response.data.message || "Failed to create staff.");
        }
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      
      // Handle specific error types
      if (err.response?.data?.message) {
        if (err.response.data.message.toLowerCase().includes("email")) {
          setEmailError("Invalid email or email already in use");
        } else if (err.response.data.message.toLowerCase().includes("username")) {
          setNameError("Username already exists");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError(err.name === 'AbortError' 
          ? "Request timed out. Please try again."
          : "An error occurred while creating staff.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer data-cy="create-staff-modal">
      <ModalHeader>
        <ModalIcon>
          <UserIDIcon />
        </ModalIcon>
        <ModalTitle>CREATE NEW STAFF</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* STAFF NAME */}
            <InputContainer>
              <InputLabel>STAFF NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  data-cy="staff-name"
                  placeholder="Name of the Staff"
                  value={staffName}
                  onChange={(e) => {
                    setStaffName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  onBlur={(e) => validateUsername(e.target.value)}
                  className={nameError ? "border-red-500" : ""}
                />
              </InputTextField>
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </InputContainer>

            <InputContainer>
              <InputLabel>STAFF EMAIL</InputLabel>
              <InputTextField>
                <InputIcon>
                  <EmailIcon />
                </InputIcon>
                <Input
                  data-cy="create-staff-email"
                  placeholder="Email of the Staff"
                  type="email"
                  value={staffEmail}
                  onChange={(e) => {
                    setStaffEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onBlur={(e) => validateEmailWithServer(e.target.value)}
                  className={emailError ? "border-red-500" : ""}
                  required
                />
              </InputTextField>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </InputContainer>

            {/* STAFF ROLE */}
            <InputContainer>
              <InputLabel>STAFF ROLE</InputLabel>
              <Select
                value={staffRole}
                onValueChange={(value) => {
                  console.log("Selected staff role:", value);
                  setStaffRole(value);
                }}
              >
                <ModalSelectTrigger
                  data-cy="staff-role"
                  icon={<UserIDIcon className="w-4 h-4" />}
                  placeholder="Select staff role"
                />
                <ModalSelectContent>
                  <SelectItem data-cy="role-admin" value="admin">
                    Admin
                  </SelectItem>
                  <SelectItem data-cy="role-aesthetician" value="aesthetician">
                    Aesthetician
                  </SelectItem>
                  <SelectItem data-cy="role-receptionist" value="receptionist">
                    Receptionist
                  </SelectItem>
                </ModalSelectContent>
              </Select>
            </InputContainer>

            {/* STAFF PASSWORD */}
            <InputContainer>
              <InputLabel>STAFF PASSWORD</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PasswordIcon />
                </InputIcon>
                <Input
                  data-cy="staff-password"
                  type="password"
                  placeholder="Password of the Staff"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </InputTextField>
            </InputContainer>

            {/* DESIGNATED DAY OFF */}
            <InputContainer>
              <InputLabel>DESIGNATED DAY OFF</InputLabel>
              <Select
                value={dayOff}
                onValueChange={(value) => {
                  console.log("Selected day off:", value);
                  setDayOff(value);
                }}
              >
                <ModalSelectTrigger
                  data-cy="staff-dayoff"
                  icon={<CalendarIcon className="w-4 h-4" />}
                  placeholder="Select day off"
                />
                <ModalSelectContent>
                  <SelectItem value="SUNDAY">SUNDAY</SelectItem>
                  <SelectItem value="MONDAY">MONDAY</SelectItem>
                  <SelectItem value="TUESDAY">TUESDAY</SelectItem>
                  <SelectItem value="WEDNESDAY">WEDNESDAY</SelectItem>
                  <SelectItem value="THURSDAY">THURSDAY</SelectItem>
                  <SelectItem value="FRIDAY">FRIDAY</SelectItem>
                  <SelectItem value="SATURDAY">SATURDAY</SelectItem>
                </ModalSelectContent>
              </Select>
            </InputContainer>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="flex sm:flex-row flex-col gap-4 mt-6 w-full">
            <Button
              data-cy="cancel-create-staff"
              variant="outline"
              className="md:w-1/2"
              onClick={onClose}
            >
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button
              data-cy="submit-create-staff"
              type="submit"
              className="md:w-1/2"
              disabled={loading || validating || nameError || emailError}
            >
              <PlusIcon />
              {loading ? "CREATING..." : validating ? "VALIDATING..." : "CREATE STAFF"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateStaff;