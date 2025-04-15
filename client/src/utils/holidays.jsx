import { format } from "date-fns";

export const HOLIDAYS = [
  { date: "01-01", name: "New Year's Day" },
  { date: "04-09", name: "Maundy Thursday" },
  { date: "04-10", name: "Good Friday" },
  { date: "05-01", name: "Labor Day" },
  { date: "06-12", name: "Independence Day" },
  { date: "08-21", name: "Ninoy Aquino Day" },
  { date: "08-31", name: "National Heroes Day" },
  { date: "11-30", name: "Bonifacio Day" },
  { date: "12-25", name: "Christmas Day" },
  { date: "12-30", name: "Rizal Day" }
];

export const isHoliday = (date) => {
  const monthDay = format(date, "MM-dd");
  return HOLIDAYS.some((holiday) => holiday.date === monthDay);
};

export const getHolidayName = (date) => {
  const monthDay = format(date, "MM-dd");
  const holiday = HOLIDAYS.find((h) => h.date === monthDay);
  return holiday ? holiday.name : null;
};
