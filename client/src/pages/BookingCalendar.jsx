import React, { useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "@/hooks/useModal";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

import MonthlyBookingPanel from "@/components/MonthlyBookingPanel";
import WeeklyBookingPanel from "@/components/WeeklyBookingPanel";

import MultiSelectFilter from "@/components/ui/MultiSelectFilter";
import { Loader } from "@/components/ui/Loader";

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);

  // For the checkbox filter using MultiSelectFilter
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [tempSelectedStaff, setTempSelectedStaff] = useState([]);

  // Create filter options for MultiSelectFilter
  const [filterOptions, setFilterOptions] = useState([]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getusers`, {
          withCredentials: true
        });

        const staffData = response.data.filter(
          (user) => !user.archived && user.role === "aesthetician"
        );
        setStaffList(staffData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  // Fetch patient records to get person_in_charge
  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/patient-records`,
          {
            withCredentials: true
          }
        );
        setPatientRecords(response.data);
      } catch (error) {
        console.error("Error fetching patient records:", error);
      }
    };

    fetchPatientRecords();
  }, []);

  // Fetch appointments from the server
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/appointments`);
        setAppointments(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Update filter options when unique persons are determined
  useEffect(() => {
    if (appointments.length > 0) {
      const personsInCharge = getUniquePersonsInCharge();
      const options = personsInCharge.map((person) => ({
        label: person.toUpperCase(),
        value: person
      }));
      setFilterOptions(options);

      // Initialize temp selected values with all options (for "select all" initial state)
      setTempSelectedStaff(personsInCharge);
      setSelectedStaff(personsInCharge);
    }
  }, [appointments, patientRecords]);

  // Process appointments into events for the calendar
  const processAppointments = () => {
    return appointments.map((appointment) => {
      // Get date object from the appointment
      const appointmentDate = new Date(appointment.date_of_session);

      // Extract hours and minutes from time_of_session (format: HH:MM:SS)
      const [hours, minutes] = appointment.time_of_session
        .split(":")
        .map(Number);

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

      // Find the corresponding patient record to get the person in charge
      let personInCharge = "Unassigned";
      if (appointment.patient_record_id) {
        const patientRecord = patientRecords.find(
          (record) => record.id === appointment.patient_record_id
        );
        if (patientRecord && patientRecord.person_in_charge) {
          personInCharge = patientRecord.person_in_charge;
        }
      }

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
        rawTime: appointment.time_of_session,
        personInCharge,
        patientRecordId: appointment.patient_record_id
      };
    });
  };

  // Helper to format time as "1:30PM" format
  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, "0")}${period}`;
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

  for (
    let i = new Date(startDate);
    i <= lastDayOfMonth;
    i.setDate(i.getDate() + 1)
  ) {
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

  // Apply filter changes
  const applyStaffFilters = () => {
    setSelectedStaff([...tempSelectedStaff]);
  };

  // Filter appointments based on the current view and selected staff
  const getFilteredAppointments = () => {
    const events = processAppointments();

    // First filter by date range according to view
    let dateFilteredEvents = events;

    if (view === "monthly") {
      // For monthly view, filter to current month
      dateFilteredEvents = events.filter((event) => {
        const eventDate = new Date(event.rawDate);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      });
    } else {
      // For weekly view, filter to current week
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      dateFilteredEvents = events.filter((event) => {
        const eventDate = new Date(event.rawDate);
        return eventDate >= weekStart && eventDate < weekEnd;
      });
    }

    // Then filter by selected staff if any are selected
    if (
      selectedStaff.length > 0 &&
      selectedStaff.length < getUniquePersonsInCharge().length
    ) {
      return dateFilteredEvents.filter((event) =>
        selectedStaff.includes(event.personInCharge)
      );
    }

    return dateFilteredEvents;
  };

  // Get all unique persons in charge from appointments (using patient records)
  const getUniquePersonsInCharge = () => {
    const events = processAppointments();
    const uniquePersons = [
      ...new Set(events.map((event) => event.personInCharge))
    ];
    return uniquePersons.sort();
  };

  // Count appointments for each person in charge
  const getStaffCounts = () => {
    const events = processAppointments();
    const counts = {};

    getUniquePersonsInCharge().forEach((person) => {
      counts[person] = events.filter(
        (event) => event.personInCharge === person
      ).length;
    });

    return counts;
  };

  const staffCounts = getStaffCounts();

  return (
    <div
      className="w-full flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8"
      data-cy="booking-calendar-container"
    >
      <h3
        className="text-lg dark:text-customNeutral-100 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight sm:leading-[3.75rem] font-semibold my-2 sm:my-3 md:my-4 w-full md:w-[90%]"
        data-cy="booking-calendar-title"
      >
        BOOKING CALENDAR
      </h3>
      <div
        data-cy="calendar-view"
        id="booking-container"
        className="flex flex-col shadow-custom items-center rounded-lg p-2 sm:p-3 md:p-4 lg:p-6 bg-ash-100 dark:bg-customNeutral-500 w-full md:w-[90%] mb-3 sm:mb-4 md:mb-6 lg:mb-8"
      >
        {/* Header Section */}
        <div
          className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-3 md:gap-4"
          data-cy="calendar-header"
        >
          <div
            className="flex flex-row items-center gap-1 sm:gap-2"
            data-cy="calendar-navigation"
          >
            <button
              data-cy="previous-month-btn"
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400 dark:hover:border-lavender-100 dark:text-lavender-100"
              onClick={handlePrevious}
              aria-label="Previous"
            >
              <ChevronLeftIcon
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                data-cy="previous-icon"
              />
            </button>
            <h2
              data-cy="calendar-month-label"
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold dark:text-customNeutral-100"
            >
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <button
              data-cy="next-month-btn"
              className="border border-transparent p-1 rounded hover:border-lavender-400 text-lavender-400 dark:hover:border-lavender-100 dark:text-lavender-100"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRightIcon
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                data-cy="next-icon"
              />
            </button>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-3 items-start sm:items-center justify-between sm:justify-end w-full sm:w-auto"
            data-cy="calendar-controls"
          >
            <div
              className="flex gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm lg:text-base"
              data-cy="view-toggle-buttons"
            >
              <button
                data-cy="calendar-view-monthly"
                onClick={() => setView("monthly")}
                className={`relative dark:text-customNeutral-100 inline-block px-1 sm:px-2 py-1 font-semibold overflow-hidden group ${
                  view === "monthly" ? "text-lavender-500 " : ""
                }`}
              >
                <span
                  className="hidden sm:inline"
                  data-cy="monthly-view-text-full"
                >
                  MONTHLY
                </span>
                <span className="sm:hidden " data-cy="monthly-view-text-short">
                  MONTH
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${
                    view === "monthly" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  data-cy="monthly-view-indicator"
                ></span>
              </button>

              <button
                data-cy="calendar-view-weekly"
                onClick={() => setView("weekly")}
                className={`relative dark:text-customNeutral-100 inline-block px-1 sm:px-2 py-1 font-semibold overflow-hidden group ${
                  view === "weekly"
                    ? "text-lavender-500 dark:text-customNeutral-100"
                    : ""
                }`}
              >
                <span
                  className="hidden sm:inline"
                  data-cy="weekly-view-text-full"
                >
                  WEEKLY
                </span>
                <span className="sm:hidden" data-cy="weekly-view-text-short">
                  WEEK
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${
                    view === "weekly" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  data-cy="weekly-view-indicator"
                ></span>
              </button>
            </div>

            {/* <Select
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedStaff(getUniquePersonsInCharge());
                  setTempSelectedStaff(getUniquePersonsInCharge());
                } else {
                  setSelectedStaff([value]);
                  setTempSelectedStaff([value]);
                }
              }}
              data-cy="sort-select"
            >
              <SelectTrigger
                placeholder="SORT BY"
                icon={<SortIcon />}
                data-cy="sort-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent data-cy="sort-content">
                <SelectItem value="all" data-cy="sort-option-all">
                  ALL DATA
                </SelectItem>
                {getUniquePersonsInCharge().map((person, index) => (
                  <SelectItem
                    key={index}
                    value={person}
                    data-cy={`sort-option-${index}`}
                  >
                    {person.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* Using MultiSelectFilter component for Staff filtering */}
            <MultiSelectFilter
              options={filterOptions}
              selectedValues={tempSelectedStaff}
              setSelectedValues={setTempSelectedStaff}
              placeholder="FILTER BY STAFF"
              mandatoryValues={[]}
              onApply={applyStaffFilters}
              showApplyButton={true}
              data-cy="staff-filter"
            />
          </div>
        </div>

        <div
          className="w-full flex flex-1 mt-2 sm:mt-3 md:mt-4"
          data-cy="calendar-content"
        >
          {isLoading ? (
            <div
              className="w-full py-4 sm:py-6 md:py-10 lg:py-20 text-center text-xs sm:text-sm md:text-base lg:text-lg"
              data-cy="loading-message"
            >
              <Loader />
            </div>
          ) : view === "monthly" ? (
            <div
              data-cy="monthly-calendar-view"
              className="w-full  overflow-x-auto overflow-y-hidden"
            >
              <MonthlyBookingPanel
                calendarDays={calendar}
                appointments={getFilteredAppointments()}
                currentMonth={month}
                data-cy="monthly-booking-panel"
              />
            </div>
          ) : (
            <div
              data-cy="weekly-calendar-view"
              className="w-full flex justify-center overflow-x-auto overflow-y-hidden"
            >
              <div className="w-full">
                <WeeklyBookingPanel
                  events={getFilteredAppointments()}
                  currentDate={currentDate}
                  data-cy="weekly-booking-panel"
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
