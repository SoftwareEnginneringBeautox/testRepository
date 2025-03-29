import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.VITE_API_URL;

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
} from "@/components/ui/Select";

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('Error fetching appointments:', error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Process appointments into events for the calendar
  const processAppointments = () => {
    return appointments.map(appointment => {
      // Get date object from the appointment
      const appointmentDate = new Date(appointment.date_of_session);
      
      // Extract hours and minutes from time_of_session (format: HH:MM:SS)
      const [hours, minutes] = appointment.time_of_session.split(':').map(Number);
      
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
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, '0')}${period}`;
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

  for (let i = new Date(startDate); i <= lastDayOfMonth; i.setDate(i.getDate() + 1)) {
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
      return events.filter(event => {
        const eventDate = new Date(event.rawDate);
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
      });
    } else {
      // For weekly view, filter to current week
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      return events.filter(event => {
        const eventDate = new Date(event.rawDate);
        return eventDate >= weekStart && eventDate < weekEnd;
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h3 className="text-4xl leading-[3.75rem] font-semibold my-4 w-[90%]">
        BOOKING CALENDAR
      </h3>
      <div
        id="booking-container"
        className="flex flex-col shadow-custom items-center rounded-lg p-8 bg-ash-100 w-[90%] mb-8"
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
            <h2 className="text-xl font-semibold">
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
              {/* Toggle Buttons with previous styling */}
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

        <div className="w-full flex flex-1">
          {isLoading ? (
            <div className="w-full py-20 text-center text-lg">Loading appointments...</div>
          ) : view === "monthly" ? (
            <MonthlyBookingPanel 
              calendarDays={calendar} 
              appointments={getFilteredAppointments()} 
              currentMonth={month}
            />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-full">
                <WeeklyBookingPanel 
                  events={getFilteredAppointments()} 
                  currentDate={currentDate} 
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
