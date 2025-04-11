import React from "react";

import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import DisplayEntry from "@/components/modals/DisplayEntry";

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
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px] border-spacing-y-2 border-separate table-fixed">
        <thead className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-xs sm:text-sm md:text-base lg:text-lg leading-6 sm:leading-7 md:leading-8">
          <tr className="rounded-lg">
            {days.map((day, index) => (
              <th
                key={index}
                className={`p-1 sm:p-2 w-1/7 ${
                  index === 0 ? "rounded-l-[0.5rem]" : ""
                } ${index === days.length - 1 ? "rounded-r-[0.5rem]" : ""}`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="space-y-1 sm:space-y-2">
          {calendarDays.map((week, weekIndex) => (
            <tr key={weekIndex} className="shadow-sm">
              {week.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDate(day);
                const isCurrentDay = day && isToday(day);
                const isFirstCell = dayIndex === 0;
                const isLastCell = dayIndex === week.length - 1;

                return (
                  <td
                    key={dayIndex}
                    className={`p-1 sm:p-2 align-top w-1/7 h-20 sm:h-24 md:h-28 lg:h-32 ${
                      // Ensure all cells have the same height
                      !day
                        ? "bg-gray-100 dark:bg-customNeutral-600"
                        : isCurrentDay
                        ? "border-2 border-lavender-500 dark:border-lavender-100 dark:bg-customNeutral-400 shadow-md"
                        : "bg-white dark:bg-customNeutral-400"
                    } ${
                      day && day.getMonth() !== currentMonth
                        ? "text-gray-400"
                        : ""
                    } ${isFirstCell ? "rounded-l-lg" : ""} ${
                      isLastCell ? "rounded-r-lg" : ""
                    }`}
                  >
                    {day && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Flex container for TODAY label and date number */}
                        <div className="flex justify-between items-center">
                          {isCurrentDay && (
                            <span className="text-lavender-400 dark:text-white text-[10px] sm:text-xs font-semibold">
                              TODAY
                            </span>
                          )}
                          <span className="text-right font-semibold text-xs sm:text-sm dark:text-white">
                            {day.getDate()}
                          </span>
                        </div>

                        {/* Appointments Wrapper */}
                        <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 flex-1 flex flex-col">
                          {dayAppointments.map((appointment, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] sm:text-xs p-0.5 sm:p-1 bg-lavender-400 text-white rounded truncate cursor-pointer"
                              title={`${appointment.name} - ${formatTimeDisplay(
                                appointment.rawTime
                              )}`}
                              onClick={() => handleOpenModal(appointment)}
                            >
                              <div className="font-semibold truncate">
                                {appointment.name}
                              </div>
                              <div className="truncate">
                                {formatTimeDisplay(appointment.rawTime)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {currentModal === "displayEntry" && selectedEntry && (
        <DisplayEntry
          isOpen={true}
          onClose={closeModal}
          entryData={selectedEntry}
        />
      )}
    </div>
  );
};

export default MonthlyBookingPanel;
