import React from "react";
import "./App.css";
import { CTAButton, OutlineButton, Pagination } from "./Components";
import { useState } from "react";
import ChevronLeftIcon from "./assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "./assets/icons/ChevronRightIcon";
import ChevronDownIcon from "./assets/icons/ChevronDownIcon";

// FINANCIAL OVERVIEW
// import FilterIcon from "./assets/icons/FilterIcon";
// import DownloadIcon from "./assets/icons/DownloadIcon";
// import BeautoxPieChart from "./components/BeautoxPieChart";
// import SalesChart from "./components/SalesChart";
// import PlusIcon from "./assets/icons/PlusIcon";

// LOGIN
// import UserIcon from "./assets/icons/UserIcon";
// import PasswordIcon from "./assets/icons/PasswordIcon";
// import LoginIcon from "./assets/icons/LoginIcon";
// import BeautoxLogo from "./assets/logos/Beautox.svg";

// ADMIN SERVICES
// import MonthlyBookingPanel from "./components/MonthlyBookingPanel";
// import WeeklyBookingPanel from "./components/WeeklyBookingPanel";
// import QuestionBoxIcon from "./assets/icons/QuestionBoxIcon";
// import TimeoutIcon from "./assets/icons/TimeoutIcon";

// SCHEDULE
// import SettingsIcon from "./assets/icons/SettingsIcon";
// import PackageIcon from "./assets/icons/PackageIcon";
// import EllipsisIcon from "./assets/icons/EllipsisIcon";
// import EmailIcon from "./assets/icons/EmailIcon";
// import CalendarIcon from "./assets/icons/CalendarIcon";
// import ClockIcon from "./assets/icons/ClockIcon";
// import AgeIcon from "./assets/icons/AgeIcon";
// import ArrowNorthEastIcon from "./assets/icons/ArrowNorthEastIcon";
// import UserIDIcon from "./assets/icons/UserIDIcon";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Fin from "./pages/FinancialOverview";
import AdministratorDashboard from "./pages/AdminDashboard";

function App() {
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

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/Financial" element={<Fin />} />
          <Route path="/AdminDashboard" element={<AdministratorDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
