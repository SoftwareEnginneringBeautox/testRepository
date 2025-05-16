import { format, subDays } from "date-fns";

// Compute Easter Sunday using Meeus/Jones/Butcher algorithm
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // March = 3, April = 4
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day); // JS months are 0-based
}

// Fixed-date holidays
const STATIC_HOLIDAYS = [
  { date: "01-01", name: "New Year's Day" },
  { date: "12-25", name: "Christmas Day" },
  { date: "12-31", name: "New Year's Eve" }
];

// Add Holy Week (dynamic) holidays for the given year
function getHolidaysForYear(year) {
  const easter = getEasterSunday(year);
  const maundyThursday = subDays(easter, 3);
  const goodFriday = subDays(easter, 2);

  const dynamicHolidays = [
    { date: format(maundyThursday, "MM-dd"), name: "Maundy Thursday" },
    { date: format(goodFriday, "MM-dd"), name: "Good Friday" }
  ];

  return [...STATIC_HOLIDAYS, ...dynamicHolidays];
}

// Check if the given date is a holiday
export function isHoliday(date) {
  const mmdd = format(date, "MM-dd");
  const year = date.getFullYear();
  return getHolidaysForYear(year).some((holiday) => holiday.date === mmdd);
}

// Get the name of the holiday if it is one
export function getHolidayName(date) {
  const mmdd = format(date, "MM-dd");
  const year = date.getFullYear();
  const holiday = getHolidaysForYear(year).find((h) => h.date === mmdd);
  return holiday ? holiday.name : null;
}
