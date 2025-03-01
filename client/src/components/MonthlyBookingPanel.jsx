import React from "react";

const MonthlyBookingPanel = ({ calendarDays = [] }) => {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-lavender-400 text-customNeutral-100 text-center font-semibold text-[1.25rem] leading-8">
          <tr>
            {["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"].map((day) => (
              <th
                key={day}
                className={`p-2 ${day === "SUN" ? "rounded-l-[0.5rem]" : ""} ${
                  day === "SAT" ? "rounded-r-[0.5rem]" : ""
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      {/* Add a spacer div */}
      <div className="h-2 bg-transparent"></div>
      <table className="w-full table-fixed border-collapse">
        {/* tbody stays intact */}
        <tbody className="text-center">
          {calendarDays.map((week, index) => (
            <tr key={index}>
              {week.map((day, idx) => (
                <td key={idx} className="p-2">
                  <button
                    className={`w-[100%] h-[100%] p-2 ${
                      day
                        ? "border-lavender-400 border-2 rounded text-lavender-400 font-semibold"
                        : ""
                    }`}
                  >
                    {day ? day.getDate() : ""}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyBookingPanel;
