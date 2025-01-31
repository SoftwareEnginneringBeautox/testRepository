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
import EllipsisIcon from "@/assets/icons/EllipsisIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function StaffDashboard() {
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

  //dummy data for passing objects through table
  const packages = [
    {
      productID: "1234432112",
      package: "duchess",
      treatment: "steaming",
      sessions: 5,
      price: 4999
    },
    {
      productID: "123433522",
      package: "me-so sexy",
      treatment: "mesolipo",
      sessions: 30,
      price: 14999
    },
    {
      productID: "765479901",
      package: "hifu 7d",
      treatment: "slimming",
      sessions: 4,
      price: 9999
    },
    {
      productID: "1234664891",
      package: "empress",
      treatment: "diode lazer",
      sessions: 6,
      price: 14999
    }
  ];

  return (
    <div className="flex items-start gap-12 justify-center ">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center rounded-lg gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserIcon size={32} />
          </div>
          <h2 className="text-[2rem] leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, STAFF
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
              <td className="flex items-start gap-4">
                <CalendarIcon />
                check 1
              </td>
            </tr>
            <tr>
              <td className="flex items-start gap-4">
                <CalendarIcon />
                check 2
              </td>
            </tr>
            <tr>
              <td className="flex items-start gap-4">
                <CalendarIcon />
                check 3
              </td>
            </tr>
            <tr>
              <td className="flex items-start gap-4">
                <CalendarIcon />
                check 4
              </td>
            </tr>
          </tbody>
        </table>
        <table className="PRISM-table table-fixed">
          <thead>
            <tr>
              <th>PRODUCT ID</th>
              <th>PACKAGE</th>
              <th>TREATMENTS</th>
              <th>SESSIONS</th>
              <th>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((product, index) => (
              <tr key={index}>
                <td>{product.productID}</td>
                <td>{product.package.toUpperCase()}</td>
                <td>{product.treatment.toUpperCase()}</td>
                <td>{product.sessions}</td>
                <td>PHP {product.price.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      </div>
    </div>
  );
}

export default StaffDashboard;
