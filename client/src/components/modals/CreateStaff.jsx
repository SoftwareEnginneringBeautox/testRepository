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
  SelectValue,
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

function CreateStaff({ isOpen, onClose }) {
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [dayOff, setDayOff] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting staff:", {
      staffName,
      staffRole,
      staffPassword,
      dayOff
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/adduser`,
        {
          username: staffName,
          password: staffPassword,
          role: staffRole,
          dayoff: dayOff
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        onClose();
      } else {
        setError(response.data.message || "Failed to create staff.");
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      setError("An error occurred while creating staff.");
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
                  <SelectItem data-cy="role-aesthetician" value="aesthetician">Aesthetician</SelectItem>
                  <SelectItem data-cy="role-receptionist" value="receptionist">Receptionist</SelectItem>
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

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button data-cy="cancel-create-staff" variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button data-cy="submit-create-staff" type="submit" className="w-1/2" disabled={loading}>
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
