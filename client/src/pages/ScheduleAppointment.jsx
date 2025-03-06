import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import UserIcon from "../assets/icons/UserIcon";
import EmailIcon from "../assets/icons/EmailIcon";
import UserIDIcon from "../assets/icons/UserIDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import AgeIcon from "../assets/icons/AgeIcon";
import ArrowNorthEastIcon from "../assets/icons/ArrowNorthEastIcon";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

function ScheduleAppointment() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center justify-center text-left w-full min-h-screen mx-auto ">
      <div className="flex flex-col w-[90%] gap-4">
        <h4 className="text-[2rem] leading-[44.8px] font-semibold">
          SCHEDULE APPOINTMENT
        </h4>
        <form action="" className="flex flex-col gap-5">
          <InputContainer>
            <InputLabel>FULL NAME</InputLabel>
            <InputTextField>
              <InputIcon>
                <UserIcon />
              </InputIcon>
              <Input
                type="text"
                id="password"
                className="text-input"
                placeholder="Full name"
                required
              />
            </InputTextField>
          </InputContainer>

          <InputContainer>
            <InputLabel>CONTACT NUMBER</InputLabel>
            <InputTextField>
              <InputIcon>
                <UserIDIcon />
              </InputIcon>
              <Input
                type="tel"
                className="text-input"
                placeholder="Contact Number"
                required
              />
            </InputTextField>
          </InputContainer>

          <InputContainer>
            <InputLabel>AGE</InputLabel>
            <InputTextField>
              <InputIcon>
                <AgeIcon />
              </InputIcon>
              <Input
                type="number"
                className="text-input"
                placeholder="Age"
                required
              />
            </InputTextField>
          </InputContainer>

          <InputContainer>
            <InputLabel>EMAIL</InputLabel>
            <InputTextField>
              <InputIcon>
                <EmailIcon />
              </InputIcon>
              <Input
                type="text"
                className="text-input"
                placeholder="Email"
                required
              />
            </InputTextField>
          </InputContainer>

          <div className="flex flex-row w-full gap-4">
            <InputContainer className="flex-1">
              <InputLabel>DATE OF SESSION</InputLabel>
              <InputTextField>
                <InputIcon>
                  <CalendarIcon />
                </InputIcon>
                <Input
                  type="date"
                  className="text-input"
                  placeholder="Date of Session"
                  required
                />
              </InputTextField>
            </InputContainer>

            <InputContainer className="flex-1">
              <InputLabel>TIME OF SESSION</InputLabel>
              <InputTextField className="flex-1">
                <InputIcon>
                  <ClockIcon />
                </InputIcon>
                <Input
                  type="time"
                  className="text-input"
                  placeholder="e.g. john_doe123"
                  required
                />
              </InputTextField>
            </InputContainer>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <Button
              variant="outline"
              fullWidth={true}
              type="button"
              onClick={handleReturn}
            >
              <ChevronLeftIcon />
              RETURN
            </Button>

            <Button fullWidth={true}>
              <ArrowNorthEastIcon />
              SUBMIT SCHEDULE APPOINTMENT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleAppointment;
