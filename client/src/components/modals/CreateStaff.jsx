import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.VITE_API_URL;

import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalIcon,
  ModalBody,
} from "@/components/ui/Modal";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input,
} from "@/components/ui/Input";

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

    console.log("Submitting staff:", { staffName, staffRole, staffPassword, dayOff });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/adduser`,
        {
          username: staffName,
          password: staffPassword,
          role: staffRole,
          dayoff: dayOff,
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
    <ModalContainer>
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
                  placeholder="Name of the Staff"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </InputTextField>
            </InputContainer>

            {/* STAFF ROLE */}
            <InputContainer>
              <InputLabel>STAFF ROLE</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIDIcon className="w-4 h-4" />
                </InputIcon>
                <select
                  className="w-full p-2 border rounded bg-[#F5F3F0]"
                  value={staffRole}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected staff role:", selectedValue);
                    setStaffRole(selectedValue);
                  }}
                >
                  <option value="">Select staff role</option>
                  <option value="aesthetician">Aesthetician</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </InputTextField>
            </InputContainer>

            {/* STAFF PASSWORD */}
            <InputContainer>
              <InputLabel>STAFF PASSWORD</InputLabel>
              <InputTextField>
                <InputIcon>
                  <PasswordIcon />
                </InputIcon>
                <Input
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
              <InputTextField>
                <InputIcon>
                  <CalendarIcon className="w-4 h-4" />
                </InputIcon>
                <select
                  className="w-full p-2 border rounded bg-[#F5F3F0]"
                  value={dayOff}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected day off:", selectedValue);
                    setDayOff(selectedValue);
                  }}
                >
                  <option value="">Select day off</option>
                  <option value="SUNDAY">SUNDAY</option>
                  <option value="MONDAY">MONDAY</option>
                  <option value="TUESDAY">TUESDAY</option>
                  <option value="WEDNESDAY">WEDNESDAY</option>
                  <option value="THURSDAY">THURSDAY</option>
                  <option value="FRIDAY">FRIDAY</option>
                  <option value="SATURDAY">SATURDAY</option>
                </select>
              </InputTextField>
            </InputContainer>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button type="submit" className="w-1/2" disabled={loading}>
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
