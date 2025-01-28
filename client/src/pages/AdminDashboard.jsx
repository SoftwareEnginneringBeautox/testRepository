import React from "react";
import "../App.css";
import { CTAButton } from "../Components";
import { useState } from "react";

import SalesChart from "../components/SalesChart";
import PlusIcon from "../assets/icons/PlusIcon";

import UserIcon from "../assets/icons/UserIcon";

import UserAdminIcon from "../assets/icons/UserAdminIcon";

import {
  AlertContainer,
  AlertDescription,
  AlertTitle,
  AlertText,
  CloseAlert
} from "@/components/ui/Alert";
import InformationIcon from "../assets/icons/InformationIcon";

function AdministratorDashboard() {
  const [displayAlert, setDisplayAlert] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const getStartOfWeek = (date) => {
    const startDate = date.getDate() - date.getDay();
    return new Date(date.setDate(startDate));
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const calendar = [];
  let currentWeek = [];

  for (let i = startDate; i <= lastDayOfMonth; i.setDate(i.getDate() + 1)) {
    const currentDate = new Date(i);
    if (currentDate.getMonth() === month) {
      currentWeek.push(currentDate);
    } else {
      currentWeek.push(null);
    }

    if (currentWeek.length === 7) {
      calendar.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    calendar.push(currentWeek);
  }

  const handlePrevious = () => {
    if (view === "monthly") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === "monthly") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const events = [
    {
      day: "WED",
      startTime: "9:00AM",
      endTime: "10:30AM",
      name: "Alice Alex",
      description: "Me So Sexy Package"
    },
    {
      day: "FRI",
      startTime: "5:00PM",
      endTime: "6:00PM",
      name: "Violet Jessica",
      description: "Brazilian"
    }
  ];

  const currentStaff = [
    "Jessica Simpson",
    "Alice Alex",
    "Violet Jessica",
    "Patrick Star "
  ];

  const [showAlert, setShowAlert] = useState(false);

  const throwAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 15000);
  };

  return (
    <div className="flex items-start gap-16 justify-center ">
      {showAlert && (
        <AlertContainer>
          <InformationIcon />
          <AlertText>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </AlertText>

          <CloseAlert onClick={() => setShowAlert(false)}>&times;</CloseAlert>
        </AlertContainer>
      )}
      <div className="w-3/4 flex flex-col gap-8">
        <div className="flex items-center rounded-lg gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserAdminIcon size={32} />
          </div>
          <h2 className="text-[2rem] leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, ADMINISTRATOR
          </h2>
        </div>
        <table className="PRISM-table">
          <thead>
            <tr className="text-left">
              <th>REMINDERS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>check</td>
            </tr>
          </tbody>
        </table>
        <SalesChart />
        <br />
      </div>
      <div className="w-1/4 shadow-custom p-12 bg-ash-100 rounded-lg h-auto flex flex-col items-center gap-4">
        <h3 className="flex items-center gap-2 text-[2rem] leading-[2.8rem] font-semibold">
          <UserIcon size={32} />
          STAFF LIST
        </h3>

        {currentStaff.map((staffName, index) => (
          <div
            key={index}
            className="w-full flex justify-between rounded-md border-2 font-semibold border-reflexBlue-400 px-4 py-3"
          >
            {staffName}
            <button type="submit">...</button>
          </div>
        ))}

        <CTAButton
          text="ADD NEW STAFF"
          leftIcon={<PlusIcon />}
          rightIcon={<UserIcon />}
          fullWidth={true}
          action={throwAlert}
        />
      </div>
    </div>
  );
}

export default AdministratorDashboard;
