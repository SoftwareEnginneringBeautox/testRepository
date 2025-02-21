import React from "react";

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

import {
  Select,
  ModalSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectIcon,
  SelectValue
} from "@/components/ui/select";

import EditIcon from "@/assets/icons/EditIcon";
import UserIcon from "@/assets/icons/UserIcon";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import UserAdminIcon from "@/assets/icons/UserAdminIcon";
import UserIDIcon from "@/assets/icons/UserIDIcon";

const ModifyStaff = ({ staffList }) => {
  return (
    <ModalContainer>
      <ModalHeader>
        <ModalIcon>
          <UserIDIcon />
        </ModalIcon>
        <ModalTitle>MODIFY STAFF</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form action="">
          <div className="flex flex-col gap-4">
            <InputContainer>
              <InputLabel>STAFF NAME</InputLabel>
              <ModalSelect
                placeholder="Name of the Staff"
                icon={<UserIcon className="w-4 h-4" />}
              >
                {staffList.map((staff, index) => (
                  <SelectItem key={index} value={staff}>
                    {staff.toUpperCase()}
                  </SelectItem>
                ))}
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>NEW STAFF NAME</InputLabel>
              <InputTextField>
                <InputIcon>
                  <UserIcon />
                </InputIcon>
                <Input placeholder="New Name of the Staff" />
              </InputTextField>
            </InputContainer>

            <InputContainer>
              <InputLabel>STAFF ROLE</InputLabel>

              <ModalSelect
                placeholder="Role of the Staff"
                icon={<UserIDIcon className="w-4 h-4 " />}
              >
                <SelectItem value="AESTHETICIAN">AESTHETICIAN</SelectItem>
                <SelectItem value="RECEPTIONIST">RECEPTIONIST</SelectItem>
              </ModalSelect>
            </InputContainer>

            <InputContainer>
              <InputLabel>DESIGNATED DAY OFF</InputLabel>
              <ModalSelect
                placeholder="Day Off of the Staff"
                icon={<CalendarIcon className="w-4 h-4" />}
              >
                <SelectItem value="SUNDAY">SUNDAY</SelectItem>
                <SelectItem value="MONDAY">MONDAY</SelectItem>
                <SelectItem value="TUESDAY">TUESDAY</SelectItem>
                <SelectItem value="WEDNESDAY">WEDNESDAY</SelectItem>
                <SelectItem value="THURSDAY">THURSDAY</SelectItem>
                <SelectItem value="FRIDAY">FRIDAY</SelectItem>
                <SelectItem value="SATURDAY">SATURDAY</SelectItem>
              </ModalSelect>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-4 mt-6 w-full">
            <Button variant="outline" className="w-1/3">
              <ChevronLeftIcon />
              CANCEL AND RETURN
            </Button>
            <Button className="w-1/3">
              <DeleteIcon />
              REMOVE STAFF
            </Button>
            <Button className="w-1/3">
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
