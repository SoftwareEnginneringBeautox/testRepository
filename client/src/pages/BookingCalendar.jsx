import React from "react";
import { useState } from "react";

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import FilterIcon from "@/assets/icons/FilterIcon";

import MonthlyBookingPanel from "@/components/MonthlyBookingPanel";
import WeeklyBookingPanel from "@/components/WeeklyBookingPanel";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from "@/components/ui/select";

function BookingCalendar() {
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
    <div className="w-full">
      <h3 className="text-4xl leading-[3.75rem] font-semibold my-4">
        BOOKING CALENDAR
      </h3>
      <div
        id="booking-container"
        className="flex flex-col shadow-custom items-center rounded-lg p-8 bg-ash-100 w-full"
      >
        {/* Header Section */}
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <button
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
              onClick={handlePrevious}
            >
              <ChevronLeftIcon />
            </button>
            <h2 className="text-xl font-semibold ">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
              onClick={handleNext}
            >
              <ChevronRightIcon />
            </button>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex gap-2 p-4 text-xl">
              {/* Toggle Buttons */}
              <button
                onClick={() => setView("monthly")}
                className="relative inline-block px-2 py-1 font-semibold overflow-hidden group"
              >
                MONTHLY
                <span className="absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 group-hover:w-full"></span>
              </button>

              <button
                onClick={() => setView("weekly")}
                className="relative inline-block px-2 py-1 font-semibold overflow-hidden group"
              >
                WEEKLY
                <span className="absolute left-0 bottom-0 block w-0 h-0.5 bg-lavender-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            <Select>
              <SelectTrigger placeholder="FILTER" icon={<FilterIcon />}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full flex justify-center">
          {view === "monthly" ? (
            <MonthlyBookingPanel calendarDays={calendar} />
          ) : (
            <div className="w-full min-w-screen">
              {" "}
              {/* Ensuring weekly panel has a sensible max width */}
              <WeeklyBookingPanel events={events} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
