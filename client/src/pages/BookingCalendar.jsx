import React, { useState, useEffect, useReducer, useRef, useCallback } from "react";
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
  // Main states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);

  // For filtering
  const [staffList, setStaffList] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [tempSelectedStaff, setTempSelectedStaff] = useState([]);

  // State that directly controls what's displayed
  const [displayedAppointments, setDisplayedAppointments] = useState([]);

  // Force update mechanism
  const [renderKey, setRenderKey] = useState(0);
  const forceRender = () => setRenderKey(prev => prev + 1);

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
          `${API_BASE_URL}/api/patients`,
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

  // Process appointments into events for the calendar
  const processAppointments = useCallback(() => {
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

      // Find the corresponding patient record to get additional information
      let personInCharge = "Unassigned";
      let patientRecord = null;
      let packageName = "";
      let totalAmount = "";
      let packageDiscount = "";
      let paymentMethod = "";
      let consentFormSigned = false;
      let amountPaid = "";
      let remainingBalance = "";
      let referenceNumber = "";
      let treatmentIds = [];
      let sessionsLeft = "";

      if (appointment.patient_record_id) {
        patientRecord = patientRecords.find(
          (record) => record.id === appointment.patient_record_id
        );

        if (patientRecord) {
          personInCharge = patientRecord.person_in_charge || "Unassigned";
          packageName = patientRecord.package_name || "";
          totalAmount = patientRecord.total_amount || "";
          packageDiscount = patientRecord.package_discount || "";
          paymentMethod = patientRecord.payment_method || "";
          consentFormSigned = patientRecord.consent_form_signed || false;
          amountPaid = patientRecord.amount_paid || "";
          remainingBalance = patientRecord.remaining_balance || "";
          referenceNumber = patientRecord.reference_number || "";
          treatmentIds = patientRecord.treatment_ids || [];
          sessionsLeft = patientRecord.sessions_left || "";
        }
      }

      return {
        id: appointment.id,
        day: dayAbbreviation,
        appdate: appointmentDate,
        startTime,
        endTime,
        name: appointment.full_name,
        description: `Age: ${appointment.age}`,
        contactNumber: appointment.contact_number,
        email: appointment.email,
        rawDate: appointment.date_of_session,
        rawTime: appointment.time_of_session,
        personInCharge,
        patientRecordId: appointment.patient_record_id,
        // Additional patient record data
        packageName,
        totalAmount,
        packageDiscount,
        paymentMethod,
        consentFormSigned,
        amountPaid,
        remainingBalance,
        referenceNumber,
        treatmentIds,
        sessionsLeft,
        // Include the complete patient record for any other needed fields
        patientRecord
      };
    });
  }, [appointments, patientRecords]);

  // Get unique persons in charge from all appointments
  const getUniquePersonsInCharge = useCallback(() => {
    const events = processAppointments();
    const uniquePersons = [
      ...new Set(events.map((event) => event.personInCharge))
    ];
    return uniquePersons.sort();
  }, [processAppointments]);

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

  // Update filter options when data is loaded
  useEffect(() => {
    if (appointments.length > 0 && patientRecords.length > 0) {
      const personsInCharge = getUniquePersonsInCharge();

      console.log("Unique persons in charge:", personsInCharge);

      const options = personsInCharge.map((person) => ({
        label: person.toUpperCase(),
        value: person
      }));
      setFilterOptions(options);

      // Initialize temp selected values with all options values (for "select all" initial state)
      setTempSelectedStaff(personsInCharge);

      // Set initial displayed appointments (all appointments)
      updateDisplayedAppointments(personsInCharge);
    }
  }, [appointments, patientRecords, getUniquePersonsInCharge]);

  // Calendar setup
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

  // Navigation handlers
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

  // Filter appointments and update displayed appointments
  const updateDisplayedAppointments = useCallback((staffToFilter) => {
    console.log("Updating displayed appointments with staff filter:", staffToFilter);

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
      staffToFilter.length > 0 &&
      staffToFilter.length < getUniquePersonsInCharge().length
    ) {
      console.log("Filtering by specific staff:", staffToFilter);

      // Normalize staff values to handle both string and object formats
      const selectedValues = staffToFilter.map(item =>
        typeof item === 'object' && item !== null && item.value ? item.value : item
      );

      console.log("Normalized staff values:", selectedValues);

      const filtered = dateFilteredEvents.filter((event) => {
        const result = selectedValues.includes(event.personInCharge);
        console.log(`Event ${event.id}, person: "${event.personInCharge}", included? ${result}`);
        return result;
      });

      console.log(`Filtered from ${dateFilteredEvents.length} to ${filtered.length} appointments`);
      setDisplayedAppointments(filtered);
    } else {
      setDisplayedAppointments(dateFilteredEvents);
    }

    // Force a re-render
    forceRender();
  }, [processAppointments, view, month, year, currentDate, getUniquePersonsInCharge]);

  // Update displayed appointments when view or date changes
  useEffect(() => {
    if (tempSelectedStaff.length > 0) {
      updateDisplayedAppointments(tempSelectedStaff);
    }
  }, [view, currentDate, updateDisplayedAppointments, tempSelectedStaff]);

  // Apply staff filter
  const applyStaffFilters = () => {
    console.log("Apply button clicked with selections:", tempSelectedStaff);

    // Immediately update displayed appointments with the current temp selection
    updateDisplayedAppointments(tempSelectedStaff);

    return tempSelectedStaff;
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center px-2 sm:px-3 md:px-4 lg:px-6"
      data-cy="booking-calendar-container"
    >
      <h3
        className="text-base dark:text-customNeutral-100 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight sm:leading-[2.5rem] font-semibold my-2 sm:my-3 md:my-4 w-full md:w-[90%]"
        data-cy="booking-calendar-title"
      >
        BOOKING CALENDAR
      </h3>
      <div
        data-cy="calendar-view"
        id="booking-container"
        className="flex flex-col shadow-custom items-center rounded-lg p-1.5 sm:p-2 md:p-3 lg:p-4 bg-ash-100 dark:bg-customNeutral-500 w-full md:w-[90%] mb-2 sm:mb-3 md:mb-4 lg:mb-6"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center gap-0.5 sm:gap-1" data-cy="calendar-navigation">
              <button
                data-cy="previous-month-btn"
                className="border border-transparent p-0.5 sm:p-1 rounded hover:border-lavender-400 text-lavender-400 dark:hover:border-lavender-100 dark:text-lavender-100"
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
                className="border border-transparent p-0.5 sm:p-1 rounded hover:border-lavender-400 text-lavender-400 dark:hover:border-lavender-100 dark:text-lavender-100"
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
              className="flex gap-0.5 sm:gap-1 text-xs sm:text-base md:text-lg lg:text-xl"
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
                <span className="sm:hidden" data-cy="monthly-view-text-short">
                  MONTHLY
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${view === "monthly" ? "w-full" : "w-0 group-hover:w-full"
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
                  WEEKLY
                </span>
                <span
                  className={`absolute left-0 bottom-0 block h-0.5 bg-lavender-400 transition-all duration-300 ${view === "weekly" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  data-cy="weekly-view-indicator"
                ></span>
              </button>
            </div>
          </div>

          {/* Using MultiSelectFilter component for Staff filtering */}
          <div className="flex justify-end w-full">
            <MultiSelectFilter
              options={filterOptions}
              selectedValues={tempSelectedStaff}
              setSelectedValues={setTempSelectedStaff}
              placeholder="FILTER BY STAFF"
              mandatoryValues={[]}
              onApply={applyStaffFilters}
              showApplyButton={true}
              className="h-8 sm:h-10 md:h-12 min-w-[100px] sm:min-w-[120px] md:min-w-[150px]"
              data-cy="staff-filter"
            />
          </div>
        </div>

        <div
          className="w-full flex flex-1 mt-1.5 sm:mt-2 md:mt-3"
          data-cy="calendar-content"
        >
          {isLoading ? (
            <div
              className="w-full py-3 sm:py-4 md:py-6 lg:py-8 text-center text-xs sm:text-sm md:text-base lg:text-lg"
              data-cy="loading-message"
            >
              <Loader />
            </div>
          ) : view === "monthly" ? (
            <div
              data-cy="monthly-calendar-view"
              className="w-full overflow-x-auto overflow-y-hidden"
            >
              <MonthlyBookingPanel
                calendarDays={calendar}
                appointments={displayedAppointments}
                currentMonth={month}
                data-cy="monthly-booking-panel"
                key={`monthly-${renderKey}-${view}-${month}-${year}`}
              />
            </div>
          ) : (
            <div
              data-cy="weekly-calendar-view"
              className="w-full flex justify-center overflow-x-auto overflow-y-hidden"
            >
              <div className="w-full">
                <WeeklyBookingPanel
                  events={displayedAppointments}
                  currentDate={currentDate}
                  data-cy="weekly-booking-panel"
                  key={`weekly-${renderKey}-${view}-${currentDate.toISOString()}`}
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