import React from "react";

const WeeklyBookingPanel = ({ events = [] }) => {
  const days = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i % 12 || 12}:00${i < 12 ? "AM" : "PM"}`;
  });

  const parseTime = (time) => {
    const [_, hour, minute, period] = time.match(/(\d+):?(\d{2})?(AM|PM)/i);
    const isPM = period.toUpperCase() === "PM";
    return {
      hours: (hour % 12) + (isPM ? 12 : 0),
      minutes: +minute || 0
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

  return (
    <div className="min-w-[95%]">
      <table className="w-full">
        <thead className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-[1.25rem] leading-8 py-4">
          <tr>
            <th className="w-24 bg-ash-100"></th>
            {days.map((day, idx) => (
              <th
                key={idx}
                className={`p-2 ${idx === 0 ? "rounded-l-[0.5rem]" : ""} ${
                  idx === days.length - 1 ? "rounded-r-[0.5rem]" : ""
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Main Content */}
      <div className="flex relative">
        {/* Time Column */}
        <div className="w-24 flex flex-col">
          {hours.map((hour, idx) => (
            <div
              key={idx}
              className="h-16 text-right pr-4 font-semibold text-customNeutral-300"
            >
              {hour}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        <div className="flex-1 flex">
          {days.map((_, dayIdx) => (
            <div key={dayIdx} className="flex-1 relative">
              {/* Time Slots */}
              <div className="absolute inset-0 flex flex-col">
                {[...Array(24)].map((_, timeIdx) => (
                  <div
                    key={timeIdx}
                    className="h-16 border-b border-gray-300"
                  ></div>
                ))}
              </div>

              {/* Events */}
              {events
                .filter((event) => event.day === days[dayIdx])
                .map((event, idx) => {
                  const { top, height } = calculateEventPosition(event);
                  return (
                    <button
                      key={idx}
                      className="absolute left-1 right-1 bg-lavender-400 text-white rounded-md p-2.5 shadow-lg focus:outline-none   text-left flex flex-col justify-end"
                      style={{ top, height }}
                    >
                      <strong className="block">{event.name}</strong>
                      <p className="text-xs">{event.description}</p>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyBookingPanel;
