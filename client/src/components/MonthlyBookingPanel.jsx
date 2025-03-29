import React from "react";

import { useState } from "react";
import { useModal } from "@/hooks/useModal"; // Ensure the correct path
import DisplayEntry from "@/components/DisplayEntry";

const MonthlyBookingPanel = ({
  calendarDays = [],
  appointments = [],
  currentMonth
}) => {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const days = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

  const handleOpenModal = (appointment) => {
    setSelectedEntry(appointment);
    openModal("displayEntry");
  };

  // Helper to check if an appointment is on a specific date
  const getAppointmentsForDate = (date) => {
    if (!date) return [];

    return appointments.filter((appointment) => {
      const appDate = new Date(appointment.rawDate);
      return (
        appDate.getDate() === date.getDate() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false;

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Format time for display
  const formatTimeDisplay = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <div className="w-full">
      <table className="w-full border-spacing-y-2 border-separate">
        <thead className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-[1.25rem] leading-8">
          <tr>
            {days.map((day, index) => (
              <th
                key={index}
                className={`p-2 ${index === 0 ? "rounded-l-[0.5rem]" : ""} ${
                  index === days.length - 1 ? "rounded-r-[0.5rem]" : ""
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarDays.map((week, weekIndex) => (
            <tr key={weekIndex} className="h-32">
              {week.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDate(day);

                return (
                  <td
                    key={dayIndex}
                    className={`p-2 align-top ${
                      !day
                        ? "bg-gray-100"
                        : isToday(day)
                        ? "bg-lavender-50"
                        : "bg-white"
                    } ${
                      day && day.getMonth() !== currentMonth
                        ? "text-gray-400"
                        : ""
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-right font-semibold">
                          {day.getDate()}
                        </div>
                        <div className="mt-2 space-y-1">
                          {dayAppointments.map((appointment, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-1 bg-lavender-400 text-white rounded truncate cursor-pointer"
                              title={`${appointment.name} - ${formatTimeDisplay(
                                appointment.rawTime
                              )}`}
                              onClick={() => handleOpenModal(appointment)}
                            >
                              <div className="font-semibold">
                                {appointment.name}
                              </div>
                              <div>
                                {formatTimeDisplay(appointment.rawTime)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyBookingPanel;
