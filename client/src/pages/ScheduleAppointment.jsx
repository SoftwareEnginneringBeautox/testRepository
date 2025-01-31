import React from "react";
import { CTAButton, OutlineButton } from "../Components";
import UserIcon from "../assets/icons/UserIcon";
import EmailIcon from "../assets/icons/EmailIcon";
import UserIDIcon from "../assets/icons/UserIDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import AgeIcon from "../assets/icons/AgeIcon";
import ArrowNorthEastIcon from "../assets/icons/ArrowNorthEastIcon";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";

function ScheduleAppointment() {
  return (
    <div>
      <h4 className="text-[2rem] leading-[44.8px] font-semibold">
        SCHEDULE APPOINTMENT
      </h4>
      <form action="" className="flex flex-col gap-5">
        <div className="input-container">
          <label htmlFor="" className="input-field-label">
            NAME
          </label>

          <div className="input-field">
            <UserIcon />
            <input
              type="text"
              className="text-input"
              placeholder="Full name"
              required
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="" className="input-field-label">
            CONTACT NUMBER
          </label>

          <div className="input-field">
            <UserIDIcon />
            <input
              type="tel"
              className="text-input"
              placeholder="Contact Number"
              required
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="" className="input-field-label">
            AGE
          </label>

          <div className="input-field">
            <AgeIcon />
            <input
              type="number"
              className="text-input"
              placeholder="Age"
              required
            />
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="" className="input-field-label">
            EMAIL
          </label>

          <div className="input-field">
            <EmailIcon />
            <input
              type="text"
              className="text-input"
              placeholder="Email"
              required
            />
          </div>
        </div>

        <div className="input-container flex flex-row w-full">
          <div className="input-container flex-1  ">
            <label htmlFor="" className="input-field-label">
              DATE OF SESSION
            </label>

            <div className="input-field">
              <CalendarIcon />
              <input
                type="date"
                className="text-input"
                placeholder="Date of Session"
                required
              />
            </div>
          </div>
          <div className="input-container flex-1">
            <label htmlFor="" className="input-field-label">
              TIME OF SESSION
            </label>

            <div className="input-field">
              <ClockIcon />
              <input
                type="time"
                className="text-input"
                placeholder="e.g. john_doe123"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <OutlineButton
            text="RETURN"
            leftIcon={<ChevronLeftIcon />}
            fullWidth={true}
          />

          <CTAButton
            text="SUBMIT SCHEDULE APPOINTMENT"
            leftIcon={<ArrowNorthEastIcon size={16} />}
            fullWidth={true}
          />
        </div>
      </form>
    </div>
  );
}

export default ScheduleAppointment;
