import React from "react";
import "../App.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useModal } from "@/hooks/useModal";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import { Loader } from "@/components/ui/Loader";
import RemindersTable from "@/components/RemindersTable";
import UserIcon from "../assets/icons/UserIcon";
import { cn } from "@/lib/utils";

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
import { Button } from "@/components/ui/Button";
import DownloadIcon from "@/assets/icons/DownloadIcon";

function StaffDashboard() {
  const [userName, setUserName] = useState(
    localStorage.getItem("username") || ""
  );
  const { currentModal, openModal, closeModal } = useModal();

  // Alert State
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    variant: "default"
  });

  // Staff State
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState(null);

  // Appointments State
  const [stagedAppointments, setStagedAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const [treatmentsData, setTreatmentsData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [loadingTreatments, setLoadingTreatments] = useState(true);
  const [errorTreatments, setErrorTreatments] = useState(null);

  // Add this new fetch function
  const fetchTreatments = useCallback(async () => {
    try {
      setLoadingTreatments(true);
      const [treatmentsRes, packagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/treatments`, {
          withCredentials: true
        }),
        axios.get(`${API_BASE_URL}/api/packages`, {
          withCredentials: true
        })
      ]);

      setTreatmentsData(treatmentsRes.data || []);
      setPackagesData(packagesRes.data || []);
      setErrorTreatments(null);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      setErrorTreatments("Failed to load treatments");
    } finally {
      setLoadingTreatments(false);
    }
  }, []);

  // Alert Functions
  const showAlert = useCallback((message, variant = "default") => {
    setAlert({ visible: true, message, variant });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000);
  }, []);

  // Staff Functions
  const fetchStaff = useCallback(async () => {
    try {
      setLoadingStaff(true);
      const response = await axios.get(`${API_BASE_URL}/getusers`, {
        withCredentials: true
      });

      const filteredStaff = response.data.filter(
        (user) =>
          (user.role === "receptionist" || user.role === "aesthetician") &&
          !user.archived
      );

      setStaffList(filteredStaff);
      setErrorStaff(null);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setErrorStaff(
        error.response?.status === 401
          ? "Session expired. Please log in again."
          : error.message
      );
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  // Appointment Functions
  const fetchAppointments = useCallback(async () => {
    try {
      setLoadingAppointments(true);

      const [stagedRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/staged-appointments/unconfirmed`, {
          withCredentials: true
        }),
        axios.get(`${API_BASE_URL}/api/appointments?archived=false`, {
          withCredentials: true
        })
      ]);

      setStagedAppointments(stagedRes.data || []);
      setReminders(appointmentsRes.data || []);
      setAppointmentError(null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointmentError("Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const handleAppointmentAction = useCallback(
    async (id, action) => {
      try {
        setLoadingAppointments(true);
        await axios.post(
          `${API_BASE_URL}/api/staged-appointments/${id}/${action}`,
          {},
          { withCredentials: true }
        );

        showAlert(
          `Appointment ${
            action === "confirm" ? "confirmed" : "rejected"
          } successfully`,
          "success"
        );
        setShowAppointmentModal(false);
        fetchAppointments();
      } catch (error) {
        console.error(`Error ${action}ing appointment:`, error);
        showAlert(`Failed to ${action} appointment`, "destructive");
      } finally {
        setLoadingAppointments(false);
      }
    },
    [API_BASE_URL, fetchAppointments, showAlert]
  );

  const handleConfirmAppointment = useCallback(
    (id) => {
      handleAppointmentAction(id, "confirm");
    },
    [handleAppointmentAction]
  );

  const handleEvaluateAppointment = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  }, []);

  const handleRejectAppointment = useCallback(
    (id) => {
      handleAppointmentAction(id, "reject");
    },
    [handleAppointmentAction]
  );

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchStaff(), fetchAppointments(), fetchTreatments()]);
    };
    fetchData();

    const pollingInterval = setInterval(fetchAppointments, 300000);
    return () => clearInterval(pollingInterval);
  }, [fetchStaff, fetchAppointments, fetchTreatments]);

  // Helper Functions
  const formatSafeDate = (dateString, formatStr) => {
    try {
      if (!dateString) return "Unknown Date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "Invalid Date";
      }
      return format(date, formatStr);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };

  const formatSafeTime = (timeString) => {
    try {
      if (!timeString) return "Unknown Time";
      const date = new Date(`1970-01-01T${timeString}`);
      if (isNaN(date.getTime())) {
        console.warn("Invalid time:", timeString);
        return "Invalid Time";
      }
      return format(date, "hh:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time Error";
    }
  };

  const getReminderLabel = (sessionDateStr) => {
    if (!sessionDateStr || typeof sessionDateStr !== "string") {
      console.warn("Invalid date format:", sessionDateStr);
      return null;
    }

    try {
      const sessionDate = new Date(sessionDateStr);
      if (isNaN(sessionDate.getTime())) {
        console.warn("Invalid session date:", sessionDateStr);
        return null;
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);

      if (sessionDate.toDateString() === today.toDateString()) return "Today";
      if (sessionDate.toDateString() === tomorrow.toDateString())
        return "Tomorrow";
      if (sessionDate.toDateString() === dayAfter.toDateString())
        return "Day After Tomorrow";

      return null;
    } catch (error) {
      console.error("Error in getReminderLabel:", error);
      return null;
    }
  };

  const handleDownloadStaffList = () => {
    // Implementation of handleDownloadStaffList function
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

        <div
          className="overflow-x-auto overflow-y-hidden"
          data-cy="reminders-table-container"
        >
          <RemindersTable
            stagedAppointments={stagedAppointments}
            reminders={reminders}
            isLoading={loadingAppointments}
            error={appointmentError}
            onEvaluateAppointment={handleEvaluateAppointment}
          />
        </div>

        {/* Treatments Table */}
        <div className="overflow-x-auto overflow-y-hidden">
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
        <div className="overflow-x-auto overflow-y-hidden">
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
        <div
          className={cn(
            "shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 dark:bg-customNeutral-500 rounded-lg flex flex-col items-center gap-3 sm:gap-4 mt-4 lg:mt-0 overflow-y-auto",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-thumb]:bg-gray-400",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-400"
          )}
        >
          <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold dark:text-customNeutral-100">
            <UserIcon size={24} className="sm:w-8 sm:h-8" />
            STAFF LIST
          </h3>
          {loadingStaff ? (
            <p className="text-sm sm:text-base dark:text-customNeutral-100">
              Loading staff...
            </p>
          ) : errorStaff ? (
            <p className="text-error-400 text-sm sm:text-base">{errorStaff}</p>
          ) : staffList.length === 0 ? (
            <p className="text-sm sm:text-base dark:text-customNeutral-100">
              No staff found.
            </p>
          ) : (
            <div className="w-full flex flex-col gap-4">
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
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  onClick={handleDownloadStaffList}
                >
                  <DownloadIcon className="w-2 h-2 sm:w-4 sm:h-4" />
                  <span>DOWNLOAD STAFF LIST</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reminders Card */}
        <div
          className={cn(
            "shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 dark:bg-customNeutral-500 rounded-lg flex flex-col items-center gap-3 sm:gap-4 overflow-y-auto",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-thumb]:bg-gray-400",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-400"
          )}
        >
          <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold dark:text-customNeutral-100">
            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            REMINDERS
          </h3>
          <div className="w-full">
            <h4 className="text-base text-center sm:text-lg font-semibold mb-2 dark:text-customNeutral-100">
              UPCOMING APPOINTMENTS
            </h4>
            <div className="flex flex-col gap-2">
              {reminders.length > 0 ? (
                reminders.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start text-xs sm:text-sm bg-white/50 dark:bg-customNeutral-400 pt-8 pb-4 px-4 rounded-lg relative min-h-[80px]"
                  >
                    {getReminderLabel(item.date_of_session) && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 text-[10px] rounded-full bg-lavender-300 text-white font-semibold whitespace-nowrap">
                          {getReminderLabel(item.date_of_session)}
                        </span>
                      </div>
                    )}
                    <div className="w-[calc(100%-100px)]">
                      <span className="dark:text-customNeutral-100 ">
                        {item.full_name} has an appointment on{" "}
                        <strong>
                          {format(
                            new Date(item.date_of_session),
                            "MMMM dd, yyyy"
                          )}
                        </strong>{" "}
                        at{" "}
                        <strong>
                          {format(
                            new Date(`1970-01-01T${item.time_of_session}`),
                            "hh:mm a"
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 dark:bg-customNeutral-400   rounded-lg">
                  <span className="dark:text-customNeutral-100">
                    No upcoming appointments in the next 3 days.
                  </span>
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
