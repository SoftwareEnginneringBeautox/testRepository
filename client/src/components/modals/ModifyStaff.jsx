import React, { useState, useEffect } from "react";

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

import {
  Select,
  ModalSelectTrigger,
  SelectValue,
  ModalSelectContent,
  SelectItem,
} from "@/components/ui/Select";


import { Button } from "../ui/Button";

import EditIcon from "@/assets/icons/EditIcon";
import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";
import EmailIcon from "@/assets/icons/EmailIcon";

const ModifyStaff = ({ isOpen, onClose, entryData, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    dayoff: "",
    email: "",
  });

  useEffect(() => {
    if (entryData) {
      setFormData({
        username: entryData.username || "",
        role: entryData.role || "",
        dayoff: entryData.dayoff || "",
        email: entryData.email || "",
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
    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value === "") delete cleanedData[key];
    });

    onSubmit({ id: entryData.id, ...cleanedData });
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <UserIDIcon />
        </ModalIcon>
        <ModalTitle>MODIFY STAFF</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>STAFF NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input
                  placeholder="New Name of the Staff"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
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
                  placeholder="Email of the Staff"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </InputTextField>
            </InputContainer>

            <InputContainer>
            <InputLabel>STAFF ROLE</InputLabel>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <ModalSelectTrigger className="w-full">
                <UserIDIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role of the Staff" />
              </ModalSelectTrigger>
              <ModalSelectContent>
                <SelectItem value="aesthetician">AESTHETICIAN</SelectItem>
                <SelectItem value="receptionist">RECEPTIONIST</SelectItem>
              </ModalSelectContent>
            </Select>
          </InputContainer>

          <InputContainer>
            <InputLabel>DESIGNATED DAY OFF</InputLabel>
            <Select
              value={formData.dayoff}
              onValueChange={(value) =>
                setFormData({ ...formData, dayoff: value })
              }
            >
              <ModalSelectTrigger className="w-full">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Day Off of the Staff" />
              </ModalSelectTrigger>
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
              
          </div>

          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/2" onClick={onClose}>
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/2" onClick={handleSubmit}>
              <EditIcon />
              EDIT STAFF
            </Button>
          </div>
        </form>
      </ModalBody>
    </ModalContainer>
  );
};

export default ModifyStaff;
