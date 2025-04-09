import React from "react";
import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import { Loader } from "@/components/ui/Loader";
import UserIcon from "../assets/icons/UserIcon";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function StaffDashboard() {
  const [userName, setUserName] = useState(
    localStorage.getItem("username") || ""
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [packagesData, setPackagesData] = useState([]);
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState(null);

  // Fetch Staff from API
  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await axios.get(`${API_BASE_URL}/getusers`, {
        withCredentials: true
      });

      const data = response.data;
      const filteredStaff = data.filter(
        (user) =>
          (user.role === "receptionist" || user.role === "aesthetician") &&
          !user.archived
      );

      setStaffList(filteredStaff);
      setErrorStaff(null);
    } catch (error) {
      console.error("Error fetching staff:", error);
      if (error.response && error.response.status === 401) {
        setErrorStaff("Session expired. Please log in again.");
      } else {
        setErrorStaff(error.message);
      }
    } finally {
      setLoadingStaff(false);
    }
  };

  // Fetch Packages data from API
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        withCredentials: true
      });
      setPackagesData(response.data.filter((item) => !item.archived));
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // Fetch Treatments data from API
  const fetchTreatments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/treatments`, {
        withCredentials: true
      });
      setTreatmentsData(response.data.filter((item) => !item.archived));
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // Fetch Reminders (upcoming appointments) from API
  const fetchReminders = async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    const dayAfterTomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date) => date.toISOString().split("T")[0];

    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments`, {
        withCredentials: true
      });
      const data = res.data || [];

      const filtered = data.filter((entry) => {
        const sessionDate = entry.date_of_session.slice(0, 10);
        return (
          sessionDate === formatDate(today) ||
          sessionDate === formatDate(tomorrow) ||
          sessionDate === formatDate(dayAfterTomorrow)
        );
      });

      setReminders(filtered);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  // Helper function to get reminder label
  const getReminderLabel = (sessionDateStr) => {
    const today = new Date();
    const tomorrow = new Date();
    const dayAfterTomorrow = new Date();

    tomorrow.setDate(today.getDate() + 1);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const format = (date) => date.toISOString().split("T")[0];
    const sessionDate = sessionDateStr.slice(0, 10);

    if (sessionDate === format(today)) return "Today";
    if (sessionDate === format(tomorrow)) return "Tomorrow";
    if (sessionDate === format(dayAfterTomorrow)) return "Day After Tomorrow";
    return null;
  };

  // Load data on component mount
  useEffect(() => {
    fetchPackages();
    fetchTreatments();
    fetchReminders();
    fetchStaff();
  }, []);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const getStartOfWeek = (date) => {
    const startDate = date.getDate() - date.getDay();
    return new Date(date.setDate(startDate));
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const calendar = [];
  let currentWeek = [];

  for (let i = startDate; i <= lastDayOfMonth; i.setDate(i.getDate() + 1)) {
    const currentDate = new Date(i);
    if (currentDate.getMonth() === month) {
      currentWeek.push(currentDate);
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

  const [showAlert, setShowAlert] = useState(false);

  const throwAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 15000);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 justify-center w-full p-3 sm:p-4 md:p-6 lg:w-[90%] mx-auto">
      {/* Left Section */}
      <div className="w-full lg:w-3/4 flex flex-col gap-4 sm:gap-6 md:gap-8">
        <div className="flex items-center rounded-lg gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserIcon size={24} className="sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, {userName.toUpperCase()}
          </h2>
        </div>
        
        {/* Treatments Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold py-4">
                  TREATMENT ID
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  TREATMENT NAME
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  PRICE
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  EXPIRATION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatmentsData.length > 0 ? (
                treatmentsData.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell className="text-center">
                      {treatment.id}
                    </TableCell>
                    <TableCell className="text-center">
                      {treatment.treatment_name}
                    </TableCell>
                    <TableCell className="text-center">
                      ₱{treatment.price}
                    </TableCell>
                    <TableCell className="text-center">
                      {treatment.expiration
                        ? `${treatment.expiration} week${
                            treatment.expiration > 1 ? "s" : ""
                          }`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    No treatments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Packages Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold py-4">
                  PRODUCT ID
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  PACKAGE
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  TREATMENT
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  SESSIONS
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  PRICE
                </TableHead>
                <TableHead className="text-center font-semibold py-4">
                  EXPIRATION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packagesData.length > 0 ? (
                packagesData.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="text-center">{pkg.id}</TableCell>
                    <TableCell className="text-center">
                      {pkg.package_name}
                    </TableCell>
                    <TableCell className="text-left">
                      {treatmentsData.length > 0 &&
                      Array.isArray(pkg.treatment_ids) &&
                      pkg.treatment_ids.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {pkg.treatment_ids.map((id) => {
                            const treatment = treatmentsData.find(
                              (t) => t.id === Number(id)
                            );
                            return treatment ? (
                              <Badge key={treatment.id} variant="outline">
                                + {treatment.treatment_name}
                              </Badge>
                            ) : (
                              <span
                                key={id}
                                className="text-error-400 text-sm italic"
                              >
                                Not found: {id}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">
                          No treatments found
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {pkg.sessions}
                    </TableCell>
                    <TableCell className="text-center">₱{pkg.price}</TableCell>
                    <TableCell className="text-center">
                      {pkg.expiration
                        ? `${pkg.expiration} week${
                            pkg.expiration > 1 ? "s" : ""
                          }`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">
                    No packages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Section - Staff List */}
      <div className="w-full lg:w-1/4 flex flex-col gap-4">
        <div className="shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 dark:bg-customNeutral-500 rounded-lg flex flex-col items-center gap-3 sm:gap-4 mt-4 lg:mt-0">
          <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold dark:text-customNeutral-100">
            <UserIcon size={24} className="sm:w-8 sm:h-8" />
            STAFF LIST
          </h3>
          {loadingStaff ? (
            <p className="text-sm sm:text-base dark:text-customNeutral-100">Loading staff...</p>
          ) : errorStaff ? (
            <p className="text-error-400 text-sm sm:text-base">{errorStaff}</p>
          ) : staffList.length === 0 ? (
            <p className="text-sm sm:text-base dark:text-customNeutral-100">No staff found.</p>
          ) : (
            <div className="w-full max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {staffList.map((staff, index) => (
                <div
                  key={index}
                  className="w-full flex justify-between border-2 border-reflexBlue-400 dark:border-lavender-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-2"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base dark:text-customNeutral-100">
                      {staff.username}
                    </span>
                    {(staff.role === "receptionist" ||
                      staff.role === "aesthetician") && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                        ({staff.role})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminders Card */}
        <div className="shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 dark:bg-customNeutral-500 rounded-lg flex flex-col items-center gap-3 sm:gap-4">
          <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold dark:text-customNeutral-100">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            REMINDERS
          </h3>
          <div className="w-full">
            <h4 className="text-base sm:text-lg font-semibold mb-2 dark:text-customNeutral-100">
              UPCOMING APPOINTMENTS
            </h4>
            <div className="flex flex-col gap-2">
              {reminders.length > 0 ? (
                reminders.map((item, index) => (
                  <div key={index} className="flex items-start text-xs sm:text-sm bg-white/50 dark:bg-customNeutral-400 p-4 rounded-lg relative min-h-[80px]">
                    {getReminderLabel(item.date_of_session) && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-[10px] rounded-full bg-lavender-300 text-white font-semibold whitespace-nowrap">
                          {getReminderLabel(item.date_of_session)}
                        </span>
                      </div>
                    )}
                    <div className="w-[calc(100%-100px)]">
                      <span className="dark:text-customNeutral-100">
                        {item.full_name} has an appointment on{" "}
                        <strong>{format(new Date(item.date_of_session), "MMMM dd, yyyy")}</strong>{" "}
                        at{" "}
                        <strong>
                          {format(new Date(`1970-01-01T${item.time_of_session}`), "hh:mm a")}
                        </strong>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 dark:bg-customNeutral-400 p-4 rounded-lg">
                  <span className="dark:text-customNeutral-100">No upcoming appointments in the next 3 days.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
