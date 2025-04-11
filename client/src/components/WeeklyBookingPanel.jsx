import React from "react";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import DisplayEntry from "@/components/modals/DisplayEntry";

const WeeklyBookingPanel = ({ events = [], currentDate }) => {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const days = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i % 12 || 12}:00${i < 12 ? "AM" : "PM"}`;
  });

  const handleOpenModal = (appointment) => {
    setSelectedEntry(appointment);
    openModal("displayEntry");
  };

  const getWeekDates = (date) => {
    const result = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      result.push(day);
    }

    return result;
  };

  const weekDates = getWeekDates(currentDate);

  const parseTime = (time) => {
    const [_, hour, minute, period] = time.match(/(\d+):?(\d{2})?(AM|PM)/i);
    const isPM = period.toUpperCase() === "PM";
    return {
      hours: parseInt(hour % 12) + (isPM ? 12 : 0),
      minutes: parseInt(minute || 0)
    };
  };

  const calculateEventPosition = (event) => {
    const start = parseTime(event.startTime);
    const end = parseTime(event.endTime);
    const startHour = start.hours + start.minutes / 60;
    const endHour = end.hours + end.minutes / 60;

    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${((endHour - startHour) / 24) * 100}%`
    };
  };

  const formatDate = (date) => {
    return `${date.getDate()}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div
      className="w-full overflow-x-auto"
      data-cy="weekly-booking-panel-container"
    >
      <table className="w-full min-w-[600px]" data-cy="weekly-booking-table">
        <thead
          className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base leading-4 sm:leading-5 md:leading-6 py-1 sm:py-2 md:py-3"
          data-cy="weekly-booking-table-header"
        >
          <tr>
            <th
              className="w-12 sm:w-16 md:w-20 bg-ash-100 dark:bg-customNeutral-500"
              data-cy="time-column-header"
            ></th>
            {days.map((day, idx) => (
              <th
                key={idx}
                className={`p-0.5 sm:p-1 ${
                  idx === 0 ? "rounded-l-[0.5rem]" : ""
                } ${idx === days.length - 1 ? "rounded-r-[0.5rem]" : ""}`}
                data-cy={`day-column-header-${day.toLowerCase()}`}
              >
                <div
                  className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm"
                  data-cy={`day-name-${day.toLowerCase()}`}
                >
                  {day}
                </div>
                <div
                  className={`text-[8px] sm:text-[10px] md:text-xs ${
                    isToday(weekDates[idx])
                      ? "bg-white text-lavender-400 rounded-full inline-block px-0.5 sm:px-1"
                      : ""
                  }`}
                  data-cy={`day-date-${day.toLowerCase()}`}
                >
                  {formatDate(weekDates[idx])}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div
        className="flex relative min-w-[600px]"
        data-cy="weekly-booking-content"
      >
        <div
          className="w-12 sm:w-16 md:w-20 flex flex-col"
          data-cy="time-column"
        >
          {hours.map((hour, idx) => (
            <div
              key={idx}
              className="h-8 sm:h-10 md:h-12 text-right pr-1 sm:pr-2 md:pr-3 font-semibold text-customNeutral-300 text-[8px] sm:text-[10px] md:text-xs"
              data-cy={`time-slot-${hour.replace(":", "-")}`}
            >
              {hour}
            </div>
          ))}
        </div>

        <div className="flex-1 flex" data-cy="days-columns">
          {days.map((_, dayIdx) => (
            <div
              key={dayIdx}
              className="flex-1 relative"
              data-cy={`day-column-${days[dayIdx].toLowerCase()}`}
            >
              <div
                className="absolute inset-0 flex flex-col"
                data-cy="hour-slots"
              >
                {[...Array(24)].map((_, timeIdx) => (
                  <div
                    key={timeIdx}
                    className="h-8 sm:h-10 md:h-12 border-b border-gray-300"
                    data-cy={`hour-slot-${timeIdx}`}
                  ></div>
                ))}
              </div>

              {events
                .filter((event) => {
                  return (
                    event.day === days[dayIdx] &&
                    new Date(event.rawDate).getDate() ===
                      weekDates[dayIdx].getDate() &&
                    new Date(event.rawDate).getMonth() ===
                      weekDates[dayIdx].getMonth() &&
                    new Date(event.rawDate).getFullYear() ===
                      weekDates[dayIdx].getFullYear()
                  );
                })
                .map((event, idx) => {
                  const { top, height } = calculateEventPosition(event);
                  return (
                    <button
                      key={idx}
                      className="absolute shadow-custom left-0.5 right-0.5 bg-lavender-400 text-white rounded-md p-0.5 sm:p-1 md:p-1.5 focus:outline-none text-left flex flex-col justify-end"
                      style={{ top, height }}
                      onClick={() => handleOpenModal(event)}
                      data-cy={`event-${event.id}`}
                    >
                      <strong
                        className="block text-[8px] sm:text-[10px] md:text-xs truncate"
                        data-cy="event-name"
                      >
                        {event.name}
                      </strong>
                      <p
                        className="text-[6px] sm:text-[8px] md:text-[10px] truncate"
                        data-cy="event-time"
                      >
                        {event.startTime} - {event.endTime}
                      </p>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
        {currentModal === "displayEntry" && selectedEntry && (
          <DisplayEntry
            isOpen={true}
            onClose={closeModal}
            entryData={selectedEntry}
            data-cy="display-entry-modal"
          />
        )}
      </div>
    </div>
  );
};

export default WeeklyBookingPanel;
