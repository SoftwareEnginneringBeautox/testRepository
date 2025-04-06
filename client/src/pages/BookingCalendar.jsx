import React, { useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "@/hooks/useModal";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";
import SortIcon from "@/assets/icons/SortIcon";

import MonthlyBookingPanel from "@/components/MonthlyBookingPanel";
import WeeklyBookingPanel from "@/components/WeeklyBookingPanel";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from "@/components/ui/Select";

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Fetch appointments from the server
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/appointments`);
        setAppointments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Process appointments into events for the calendar
  const processAppointments = () => {
    return appointments.map((appointment) => {
      // Get date object from the appointment
      const appointmentDate = new Date(appointment.date_of_session);

      // Extract hours and minutes from time_of_session (format: HH:MM:SS)
      const [hours, minutes] = appointment.time_of_session
        .split(":")
        .map(Number);

      // Set time on the appointment date
      appointmentDate.setHours(hours);
      appointmentDate.setMinutes(minutes);

      // Calculate end time (assume 1 hour duration if not specified)
      const endDate = new Date(appointmentDate);
      endDate.setHours(endDate.getHours() + 1);

      // Format times
      const startTime = formatTime(hours, minutes);
      const endTime = formatTime(endDate.getHours(), endDate.getMinutes());

      // Get day abbreviation
      const dayAbbreviation = getDayAbbreviation(appointmentDate.getDay());

      return {
        id: appointment.id,
        day: dayAbbreviation,
        date: appointmentDate,
        startTime,
        endTime,
        name: appointment.full_name,
        description: `Age: ${appointment.age}`,
        contactNumber: appointment.contact_number,
        email: appointment.email,
        rawDate: appointment.date_of_session,
        rawTime: appointment.time_of_session
      };
    });
  };

  // Helper to format time as "1:30PM" format
  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, "0")}${period}`;
  };

  // Helper to get day abbreviation
  const getDayAbbreviation = (dayIndex) => {
    const days = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
    return days[dayIndex];
  };

  const getStartOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const calendar = [];
  let currentWeek = [];

  for (
    let i = new Date(startDate);
    i <= lastDayOfMonth;
    i.setDate(i.getDate() + 1)
  ) {
    const dayDate = new Date(i);
    if (dayDate.getMonth() === month) {
      currentWeek.push(dayDate);
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

  // Filter appointments based on the current view
  const getFilteredAppointments = () => {
    const events = processAppointments();

    if (view === "monthly") {
      // For monthly view, filter to current month
      return events.filter((event) => {
        const eventDate = new Date(event.rawDate);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      });
    } else {
      // For weekly view, filter to current week
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      return events.filter((event) => {
        const eventDate = new Date(event.rawDate);
        return eventDate >= weekStart && eventDate < weekEnd;
      });
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8"
      data-cy="booking-calendar-container"
    >
      <h3
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight sm:leading-[3.75rem] font-semibold my-2 sm:my-3 md:my-4 w-full md:w-[90%]"
        data-cy="booking-calendar-title"
      >
        BOOKING CALENDAR
      </h3>
      <div
        data-cy="calendar-view"
        id="booking-container"
        className="flex flex-col shadow-custom items-center rounded-lg p-2 sm:p-3 md:p-4 lg:p-6 bg-ash-100 w-full md:w-[90%] mb-3 sm:mb-4 md:mb-6 lg:mb-8"
      >
        {/* Header Section */}
        <div
          className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-3 md:gap-4"
          data-cy="calendar-header"
        >
          <div
            className="flex flex-row items-center gap-1 sm:gap-2"
            data-cy="calendar-navigation"
          >
            <button
              data-cy="previous-month-btn"
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <ChevronLeftIcon
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                data-cy="previous-icon"
              />
            </button>
            <h2
              data-cy="calendar-month-label"
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold"
            >
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button
              data-cy="next-month-btn"
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRightIcon
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                data-cy="next-icon"
              />
            </button>
          </div>

          <div
            className="flex flex-row gap-1 sm:gap-2 md:gap-3 items-center justify-between sm:justify-end w-full sm:w-auto"
            data-cy="calendar-controls"
          >
            <div
              className="flex gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm lg:text-base"
              data-cy="view-toggle-buttons"
            >
              <button
                data-cy="calendar-view-monthly"
                onClick={() => setView("monthly")}
                className={`relative inline-block px-1 sm:px-2 py-1 font-semibold overflow-hidden group ${
                  view === "monthly" ? "text-lavender-500" : ""
                }`}
              >
                <span
                  className="hidden sm:inline"
                  data-cy="monthly-view-text-full"
                >
                  MONTHLY
                </span>
                <span className="sm:hidden" data-cy="monthly-view-text-short">
                  MONTH
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${
                    view === "monthly" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  data-cy="monthly-view-indicator"
                ></span>
              </button>

              <button
                data-cy="calendar-view-weekly"
                onClick={() => setView("weekly")}
                className={`relative inline-block px-1 sm:px-2 py-1 font-semibold overflow-hidden group ${
                  view === "weekly" ? "text-lavender-500" : ""
                }`}
              >
                <span
                  className="hidden sm:inline"
                  data-cy="weekly-view-text-full"
                >
                  WEEKLY
                </span>
                <span className="sm:hidden" data-cy="weekly-view-text-short">
                  WEEK
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${
                    view === "weekly" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  data-cy="weekly-view-indicator"
                ></span>
              </button>
            </div>

            <Select data-cy="filter-select">
              <SelectTrigger
                data-cy="filter-bookings-btn"
                placeholder="FILTER"
                icon={
                  <SortIcon
                    className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                    data-cy="sort-icon"
                  />
                }
                className="text-[10px] sm:text-xs md:text-sm lg:text-base p-1 sm:p-2"
              >
                <SelectValue data-cy="filter-select-value" />
              </SelectTrigger>
              <SelectContent data-cy="filter-select-content">
                <SelectItem value="option1" data-cy="filter-option-1">
                  Option 1
                </SelectItem>
                <SelectItem value="option2" data-cy="filter-option-2">
                  Option 2
                </SelectItem>
                <SelectItem value="option3" data-cy="filter-option-3">
                  Option 3
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className="w-full flex flex-1 mt-2 sm:mt-3 md:mt-4"
          data-cy="calendar-content"
        >
          {isLoading ? (
            <div
              className="w-full py-4 sm:py-6 md:py-10 lg:py-20 text-center text-xs sm:text-sm md:text-base lg:text-lg"
              data-cy="loading-message"
            >
              Loading appointments...
            </div>
          ) : view === "monthly" ? (
            <div
              data-cy="monthly-calendar-view"
              className="w-full overflow-x-auto"
            >
              <MonthlyBookingPanel
                calendarDays={calendar}
                appointments={getFilteredAppointments()}
                currentMonth={month}
                data-cy="monthly-booking-panel"
              />
            </div>
          ) : (
            <div
              data-cy="weekly-calendar-view"
              className="w-full flex justify-center overflow-x-auto"
            >
              <div className="w-full">
                <WeeklyBookingPanel
                  events={getFilteredAppointments()}
                  currentDate={currentDate}
                  data-cy="weekly-booking-panel"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
