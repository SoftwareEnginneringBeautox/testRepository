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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (loading) {
      console.log("Staff creation already in progress");
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
      setError(emailError);
      setLoading(false);
      return;
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
        // Handle specific email errors from server
        if (response.data.message?.toLowerCase().includes("email")) {
          setError(response.data.message || "Email error. The email may already be in use.");
        } else {
          setError(response.data.message || "Failed to create staff.");
        }
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      
      // Handle email-specific errors
      if (err.response?.data?.message?.toLowerCase().includes("email") || 
          err.message?.toLowerCase().includes("email")) {
        setError("Invalid email or email already in use");
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
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </InputTextField>
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
                    // Clear error if they're fixing their email
                    if (error && error.toLowerCase().includes("email")) {
                      setError("");
                    }
                  }}
                  className={error && error.toLowerCase().includes("email") ? "border-red-500" : ""}
                  required
                />
              </InputTextField>
              {error && error.toLowerCase().includes("email") && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
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

            {error && !error.toLowerCase().includes("email") && <p className="text-red-500">{error}</p>}
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
              disabled={loading}
            >
              <PlusIcon />
              {loading ? "CREATING..." : "CREATE STAFF"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
}

export default CreateStaff;
