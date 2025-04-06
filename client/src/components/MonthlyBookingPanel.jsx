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

  const handleArchive = async () => {
    await fetch("/api/manage-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: "expenses_tracker",
        id: selectedExpenseId,
        action: "archive"
      })
    });

    onClose(); // Close the modal
    refreshData(); // Refetch the list if needed
  };

  return (
    <div
      className="w-full overflow-x-auto"
      data-cy="monthly-booking-panel-container"
    >
      <table
        className="w-full border-spacing-y-2 border-separate table-fixed min-w-[600px]"
        data-cy="monthly-booking-table"
      >
        <thead
          className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-xs sm:text-sm md:text-base lg:text-lg leading-6 sm:leading-7 md:leading-8"
          data-cy="monthly-booking-table-header"
        >
          <tr className="rounded-lg">
            {days.map((day, index) => (
              <th
                key={index}
                className={`p-1 sm:p-2 w-1/7 ${
                  index === 0 ? "rounded-l-[0.5rem]" : ""
                } ${index === days.length - 1 ? "rounded-r-[0.5rem]" : ""}`}
                data-cy={`day-column-header-${day.toLowerCase()}`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className="space-y-1 sm:space-y-2"
          data-cy="monthly-booking-table-body"
        >
          {calendarDays.map((week, weekIndex) => (
            <tr
              key={weekIndex}
              className="shadow-sm"
              data-cy={`week-row-${weekIndex}`}
            >
              {week.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDate(day);
                const isCurrentDay = day && isToday(day);
                const isFirstCell = dayIndex === 0;
                const isLastCell = dayIndex === week.length - 1;

                return (
                  <td
                    key={dayIndex}
                    className={`p-1 sm:p-2 align-top w-1/7 h-20 sm:h-24 md:h-28 lg:h-32 ${
                      !day
                        ? "bg-gray-100"
                        : isCurrentDay
                        ? "bg-lavender-50 border-2 border-lavender-500 shadow-md"
                        : "bg-white"
                    } ${
                      day && day.getMonth() !== currentMonth
                        ? "text-gray-400"
                        : ""
                    } ${isFirstCell ? "rounded-l-lg" : ""} ${
                      isLastCell ? "rounded-r-lg" : ""
                    }`}
                    data-cy={`day-cell-${weekIndex}-${dayIndex}`}
                  >
                    {day && (
                      <div
                        className="flex flex-col justify-between h-full"
                        data-cy={`day-content-${weekIndex}-${dayIndex}`}
                      >
                        <div
                          className="flex justify-between items-center"
                          data-cy="day-header"
                        >
                          {isCurrentDay && (
                            <span
                              className="text-lavender-400 text-[10px] sm:text-xs font-semibold"
                              data-cy="today-label"
                            >
                              TODAY
                            </span>
                          )}
                          <span
                            className="text-right font-semibold text-xs sm:text-sm md:text-base"
                            data-cy="day-number"
                          >
                            {day.getDate()}
                          </span>
                        </div>

                        <div
                          className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 flex-1 flex flex-col"
                          data-cy="appointments-wrapper"
                        >
                          {dayAppointments.map((appointment, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] sm:text-xs p-0.5 sm:p-1 bg-lavender-400 text-white rounded truncate cursor-pointer"
                              title={`${appointment.name} - ${formatTimeDisplay(
                                appointment.rawTime
                              )}`}
                              onClick={() => handleOpenModal(appointment)}
                              data-cy={`appointment-${appointment.id}`}
                            >
                              <div
                                className="font-semibold truncate"
                                data-cy="appointment-name"
                              >
                                {appointment.name}
                              </div>
                              <div
                                className="truncate"
                                data-cy="appointment-time"
                              >
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
          data-cy="display-entry-modal"
        />
      )}
    </div>
  );
};

export default MonthlyBookingPanel;
