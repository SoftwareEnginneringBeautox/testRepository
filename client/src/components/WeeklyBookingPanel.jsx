import React from "react";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { isHoliday, getHolidayName } from "@/utils/holidays";
import { cn } from "@/lib/utils";
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
            {days.map((day, idx) => {
              const dayDate = weekDates[idx];
              const isHolidayDate = isHoliday(dayDate);

              return (
                <th
                  key={idx}
                  className={cn(
                    "p-0.5 sm:p-1",
                    idx === 0 ? "rounded-l-[0.5rem]" : "",
                    idx === days.length - 1 ? "rounded-r-[0.5rem]" : "",
                    isHolidayDate ? "bg-error-100 dark:bg-error-900/40" : ""
                  )}
                  data-cy={`day-column-header-${day.toLowerCase()}`}
                >
                  <div
                    className={cn(
                      "text-[8px] sm:text-[10px] md:text-xs lg:text-sm",
                      isHolidayDate ? "text-error-500 dark:text-error-400" : ""
                    )}
                    data-cy={`day-name-${day.toLowerCase()}`}
                  >
                    {day}
                  </div>
                  <div
                    className={cn(
                      "text-[8px] sm:text-[10px] md:text-xs",
                      isToday(dayDate)
                        ? "bg-white text-lavender-400 rounded-full inline-block px-0.5 sm:px-1"
                        : isHolidayDate
                        ? "text-error-500 dark:text-error-400"
                        : ""
                    )}
                    data-cy={`day-date-${day.toLowerCase()}`}
                  >
                    {formatDate(dayDate)}
                  </div>
                  {isHolidayDate && (
                    <div className="text-[8px] md:text-xs text-error-400 dark:text-error-300">
                      {getHolidayName(dayDate)}
                    </div>
                  )}
                </th>
              );
            })}
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
          {days.map((day, idx) => {
            const dayDate = weekDates[idx];
            const isHolidayDate = isHoliday(dayDate);

            return (
              <div
                key={idx}
                className={cn(
                  "flex-1 relative",
                  isHolidayDate ? "bg-error-50 dark:bg-error-900/20" : ""
                )}
                data-cy={`day-column-${day.toLowerCase()}`}
              >
                {isHolidayDate ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="transform -rotate-45 text-error-500 dark:text-error-400 font-semibold text-xs md:text-sm">
                      HOLIDAY
                    </span>
                    <span className="text-[8px] md:text-xs text-error-400 dark:text-error-300">
                      {getHolidayName(dayDate)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex flex-col">
                      {[...Array(24)].map((_, timeIdx) => (
                        <div
                          key={timeIdx}
                          className="h-8 sm:h-10 md:h-12 border-b border-customNeutral-200 dark:border-customNeutral-600"
                          data-cy={`hour-slot-${timeIdx}`}
                        />
                      ))}
                    </div>

                    {events
                      .filter(
                        (event) =>
                          event.day === day &&
                          new Date(event.rawDate).getDate() ===
                            dayDate.getDate() &&
                          new Date(event.rawDate).getMonth() ===
                            dayDate.getMonth() &&
                          new Date(event.rawDate).getFullYear() ===
                            dayDate.getFullYear()
                      )
                      .map((event, eventIdx) => {
                        const { top, height } = calculateEventPosition(event);
                        return (
                          <button
                            key={eventIdx}
                            onClick={() => handleOpenModal(event)}
                            className="absolute w-[90%] left-[5%] bg-lavender-400 dark:bg-lavender-500 text-white rounded px-1 overflow-hidden text-ellipsis whitespace-nowrap text-[8px] sm:text-[10px] md:text-xs"
                            style={{ top, height }}
                            data-cy={`event-${eventIdx}`}
                          >
                            {event.title}
                          </button>
                        );
                      })}
                  </>
                )}
              </div>
            );
          })}
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
