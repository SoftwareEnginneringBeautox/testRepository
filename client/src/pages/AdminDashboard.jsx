import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import "../App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import CreateStaff from "@/components/modals/CreateStaff";
import ModifyStaff from "@/components/modals/ModifyStaff";
import ArchiveStaff from "@/components/modals/ArchiveStaff";
import AppointmentDetails from "@/components/modals/AppointmentDetails";
import SalesChart from "../components/SalesChart";
import PlusIcon from "../assets/icons/PlusIcon";
import UserIcon from "../assets/icons/UserIcon";
import UserAdminIcon from "../assets/icons/UserAdminIcon";
import RemindersTable from "@/components/RemindersTable";
import { Loader } from "@/components/ui/Loader";
import {
  AlertContainer,
  AlertDescription,
  AlertTitle,
  AlertText,
  CloseAlert
} from "@/components/ui/Alert";
import InformationIcon from "@/assets/icons/InformationIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";
import EditIcon from "@/assets/icons/EditIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { format, parseISO } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AdministratorDashboard() {
  const { theme } = useTheme();

  // Theme-dependent colors
  const primaryColor = theme === "dark" ? "#A5B4FC" : "#3730A3"; // Light indigo for dark mode, dark purple for light mode
  const secondaryColor = theme === "dark" ? "#E9D5FF" : "#5B21B6"; // Light purple for dark mode, dark purple for light mode

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

  // Chart State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");

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

  const handleStaffAction = useCallback(
    async (action, staffData) => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/manage-record`,
          {
            table: "accounts",
            id: staffData.id,
            action,
            data: action === "edit" ? staffData : undefined
          },
          { withCredentials: true }
        );

        closeModal();
        fetchStaff();
        showAlert(`Staff successfully ${action}ed`, "success");
      } catch (error) {
        console.error(`Error ${action}ing staff:`, error);
        showAlert(`Failed to ${action} staff member`, "destructive");
      }
    },
    [closeModal, fetchStaff, showAlert]
  );

  // For backwards compatibility with existing code
  const handleEditStaff = (staffData) => handleStaffAction("edit", staffData);
  const handleArchiveStaff = (staffData) =>
    handleStaffAction("archive", staffData);

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

  // Add this before handleConfirmAppointment and handleRejectAppointment
  const handleAppointmentAction = useCallback(
    async (id, action, patientId = null) => {
      try {
        // Prevent duplicate API calls
        setLoadingAppointments(true);
        
        // Include patientId in request body if provided
        const requestBody = patientId ? { patient_record_id: patientId } : {};
        
        // Single API call with proper payload
        const response = await axios.post(
          `${API_BASE_URL}/api/staged-appointments/${id}/${action}`,
          requestBody,
          { withCredentials: true }
        );
  
        // Check response for success
        if (response.data?.success) {
          showAlert(
            `Appointment ${
              action === "confirm" ? "confirmed" : "rejected"
            } successfully`,
            "success"
          );
          setShowAppointmentModal(false);
          fetchAppointments(); // Refresh data after successful action
        } else {
          throw new Error(response.data?.message || "Unknown error");
        }
      } catch (error) {
        console.error(`Error ${action}ing appointment:`, error);
        showAlert(`Failed to ${action} appointment`, "destructive");
      } finally {
        setLoadingAppointments(false);
      }
    },
    [API_BASE_URL, fetchAppointments, showAlert]
  );

  // Update the dependency arrays for these functions
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

  // Add this useEffect for initial data loading
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchStaff(), fetchAppointments()]);
    };
    fetchData();

    // Set up polling for appointments
    const pollingInterval = setInterval(fetchAppointments, 300000); // 5 minutes

    return () => clearInterval(pollingInterval);
  }, [fetchStaff, fetchAppointments]);

  const chartData = [
    { day: "Mon", currentWeek: 1300, previousWeek: 1100 },
    { day: "Tue", currentWeek: 1400, previousWeek: 1150 },
    { day: "Wed", currentWeek: 1500, previousWeek: 1200 },
    { day: "Thu", currentWeek: 1600, previousWeek: 1250 },
    { day: "Fri", currentWeek: 1700, previousWeek: 1300 },
    { day: "Sat", currentWeek: 1800, previousWeek: 1350 },
    { day: "Sun", currentWeek: 1900, previousWeek: 1400 }
  ];

  // Chart config updated for dark mode
  const chartConfig = {
    currentWeek: {
      label: "Current Week",
      color: theme === "dark" ? primaryColor : "#381B4C"
    },
    previousWeek: {
      label: "Previous Week",
      color: theme === "dark" ? secondaryColor : "#002B7F"
    }
  };

  const getReminderLabel = (sessionDateStr) => {
    // Guard against invalid input
    if (!sessionDateStr || typeof sessionDateStr !== "string") {
      console.warn("Invalid date format:", sessionDateStr);
      return null;
    }

    try {
      // Create a date object from the full date string to properly handle timezone
      const sessionDate = new Date(sessionDateStr);

      // Check if date is valid
      if (isNaN(sessionDate.getTime())) {
        console.warn("Invalid session date:", sessionDateStr);
        return null;
      }

      // Extract year, month, and day FROM THE LOCAL TIMEZONE representation
      const sessionYear = sessionDate.getFullYear();
      const sessionMonth = sessionDate.getMonth();
      const sessionDay = sessionDate.getDate();

      // Get today's date in the same local timezone
      const today = new Date();

      // Compare only year, month, day in the local timezone
      const isSameDay = (year, month, day) => {
        return (
          year === today.getFullYear() &&
          month === today.getMonth() &&
          day === today.getDate()
        );
      };

      // Calculate tomorrow and day after tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);

      // Debug logging with actual local dates
      console.log(`Session local date: ${sessionDate.toLocaleDateString()}`);
      console.log(`Today: ${today.toLocaleDateString()}`);
      console.log(`Tomorrow: ${tomorrow.toLocaleDateString()}`);

      // Check if session date matches today/tomorrow/day after in LOCAL timezone
      if (isSameDay(sessionYear, sessionMonth, sessionDay)) {
        return "Today";
      } else if (
        sessionYear === tomorrow.getFullYear() &&
        sessionMonth === tomorrow.getMonth() &&
        sessionDay === tomorrow.getDate()
      ) {
        return "Tomorrow";
      } else if (
        sessionYear === dayAfter.getFullYear() &&
        sessionMonth === dayAfter.getMonth() &&
        sessionDay === dayAfter.getDate()
      ) {
        return "Day After Tomorrow";
      }

      return null;
    } catch (error) {
      console.error("Error in getReminderLabel:", error);
      return null;
    }
  };

  // Safe date formatting function to handle potential invalid dates
  const formatSafeDate = (dateString, formatStr) => {
    try {
      if (!dateString) return "Unknown Date";

      // Try to parse the date
      const date = new Date(dateString);

      // Check if date is valid
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

  // Safe time formatting function
  const formatSafeTime = (timeString) => {
    try {
      if (!timeString) return "Unknown Time";

      // Create a full date with the time component
      const date = new Date(`1970-01-01T${timeString}`);

      // Check if time is valid
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

  // For logic in Reminders Table

  const generateStaffListReport = (staffData = []) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const now = new Date();
    const dateString = now
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
      .toUpperCase();

    const title = `BEAUTOX PRISM STAFF LIST REPORT AS OF ${dateString}`;

    // Set font and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 50, {
      align: "center"
    });

    const tableColumnHeaders = [
      "STAFF ID",
      "STAFF NAME",
      "ROLE",
      "EMAIL",
      "DAY OFF"
    ];

    const tableRows = staffData.map((staff) => [
      staff.id || "N/A",
      staff.username?.toUpperCase() || "N/A",
      staff.role?.toUpperCase() || "N/A",
      staff.email || "N/A",
      staff.dayoff?.toUpperCase() || "N/A"
    ]);

    // Use theme-aware color for PDF header
    const headerColor = theme === "dark" ? "#5B21B6" : "#381B4C";

    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 70,
      margin: { left: 40, right: 40 },
      styles: {
        font: "helvetica",
        fontSize: 9,
        halign: "center",
        cellPadding: 3,
        overflow: "linebreak",
        minCellHeight: 14,
        valign: "middle"
      },
      headStyles: {
        fillColor: headerColor,
        textColor: "#FFFFFF",
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: "#F8F8F8"
      },
      didDrawPage: function (data) {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 40;

        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
      }
    });

    doc.save(`Beautox_StaffListReport_${now.toISOString().slice(0, 10)}.pdf`);
  };

  // Dropdown menu hover style
  const dropdownItemHoverClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div
      className="flex flex-col lg:flex-row items-start gap-6 justify-center w-full p-3 sm:p-4 md:p-6 lg:w-[90%] mx-auto"
      data-cy="admin-dashboard-container"
    >
      {alert.visible && (
        <AlertContainer
          variant={alert.variant}
          className="w-full"
          data-cy="alert-container"
        >
          <AlertText>
            <AlertTitle data-cy="alert-title">
              {alert.variant === "destructive" ? "Error" : "Notice"}
            </AlertTitle>
            <AlertDescription data-cy="alert-description">
              {alert.message}
            </AlertDescription>
          </AlertText>
          <CloseAlert
            onClick={() => setAlert((prev) => ({ ...prev, visible: false }))}
            data-cy="close-alert"
          />
        </AlertContainer>
      )}
      {/* Left Section */}
      <div
        className="w-full lg:w-3/4 flex flex-col gap-4 sm:gap-6 md:gap-8"
        data-cy="dashboard-left-section"
      >
        <div
          className="flex items-center rounded-lg gap-2 sm:gap-4"
          data-cy="welcome-section"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center"
            data-cy="admin-icon-container"
          >
            <UserAdminIcon
              size={24}
              className="sm:w-8 sm:h-8"
              data-cy="admin-icon"
            />
          </div>
          <h2
            className="text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text"
            data-cy="welcome-message"
          >
            WELCOME BACK, ADMINISTRATOR {userName.toUpperCase()}
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
        <div data-cy="sales-chart-container">
          <SalesChart
            chartData={chartData}
            chartConfig={chartConfig}
            data-cy="sales-chart"
          />
        </div>
      </div>

      {/* Right Section - Staff List */}
      <div
        className={cn(
          "w-full lg:w-1/4 shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-3 sm:gap-4 mt-4 lg:mt-0",
          "max-h-[calc(100vh-2rem)]"
        )}
        data-cy="staff-section"
      >
        <div className="flex items-center gap-2 w-full" data-cy="staff-header">
          <UserIcon
            className="sm:w-8 sm:h-8"
            data-cy="staff-icon"
            fill={theme === "dark" ? secondaryColor : "inherit"}
          />
          <h3
            className="text-lg sm:text-xl md:text-2xl lg:text-[2rem] whitespace-nowrap font-semibold dark:text-customNeutral-100"
            style={{ color: theme === "dark" ? secondaryColor : "inherit" }}
            data-cy="staff-list-title"
          >
            STAFF LIST
          </h3>
        </div>

        {loadingStaff ? (
          <div className="w-full my-6" data-cy="loading-staff-message">
            <Loader />
          </div>
        ) : errorStaff ? (
          <p
            className="text-error-400 text-sm sm:text-base"
            data-cy="staff-error-message"
          >
            {errorStaff}
          </p>
        ) : staffList.length === 0 ? (
          <p
            className="text-sm sm:text-base dark:text-gray-300"
            data-cy="no-staff-message"
          >
            No staff found.
          </p>
        ) : (
          <div
            className={cn(
              "w-full max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1",
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-thumb]:bg-gray-400",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-400"
            )}
            data-cy="staff-list-container"
          >
            {staffList.map((staff, index) => (
              <div
                key={index}
                className="w-full flex justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-2 bg-white/50 dark:bg-gray-700"
                style={
                  theme === "dark"
                    ? { border: `2px solid ${primaryColor}` }
                    : { border: "2px solid var(--reflexBlue-400)" }
                }
                data-cy={`staff-card-${index}`}
              >
                <div className="flex flex-col" data-cy={`staff-info-${index}`}>
                  <span
                    className="font-semibold text-sm sm:text-base dark:text-customNeutral-100"
                    data-cy={`staff-name-${index}`}
                  >
                    {staff.username}
                  </span>
                  {(staff.role === "receptionist" ||
                    staff.role === "aesthetician") && (
                    <span
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 capitalize"
                      data-cy={`staff-role-${index}`}
                    >
                      ({staff.role})
                    </span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    data-cy={`staff-actions-trigger-${index}`}
                  >
                    <EllipsisIcon className="w-5 h-5 sm:w-6 sm:h-6 dark:text-customNeutral-100" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="dark:bg-gray-800 dark:border-gray-700"
                    data-cy={`staff-actions-content-${index}`}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className={`dark:text-white ${dropdownItemHoverClass}`}
                        data-cy={`edit-staff-btn-${index}`}
                        onClick={() => {
                          setSelectedStaff(staff);
                          openModal("modifyStaff");
                        }}
                      >
                        <EditIcon
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                          style={{
                            color: theme === "dark" ? secondaryColor : "inherit"
                          }}
                        />
                        <p className="font-semibold text-sm sm:text-base">
                          Edit
                        </p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`dark:text-white ${dropdownItemHoverClass}`}
                        data-cy={`archive-staff-btn-${index}`}
                        onClick={() => {
                          setSelectedStaff(staff);
                          openModal("archiveStaff");
                        }}
                      >
                        <ArchiveIcon
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                          style={{
                            color: theme === "dark" ? secondaryColor : "inherit"
                          }}
                        />
                        <p className="font-semibold text-sm sm:text-base">
                          Archive
                        </p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}

        <Button
          data-cy="add-staff-btn"
          fullWidth="true"
          size="sm"
          onClick={() => openModal("createStaff")}
          className="mt-2 text-sm dark:bg-indigo-700 dark:hover:bg-indigo-600"
          style={theme === "dark" ? { background: primaryColor } : {}}
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          ADD NEW STAFF
        </Button>

        <Button
          data-cy="download-staff-btn"
          fullWidth="true"
          size="sm"
          onClick={() => generateStaffListReport(staffList)}
          className="mt-2 text-sm dark:bg-indigo-700 dark:hover:bg-indigo-600"
          style={theme === "dark" ? { background: primaryColor } : {}}
        >
          <DownloadIcon className="w-4 h-4 mr-1" />
          DOWNLOAD STAFF LIST
        </Button>

        {currentModal === "createStaff" && (
          <CreateStaff
            isOpen={true}
            onClose={() => {
              closeModal();
              fetchStaff();
            }}
            data-cy="create-staff-modal"
          />
        )}
        {currentModal === "modifyStaff" && selectedStaff && (
          <ModifyStaff
            isOpen={true}
            onClose={closeModal}
            entryData={selectedStaff}
            onSubmit={handleEditStaff}
            data-cy="modify-staff-modal"
          />
        )}
        {currentModal === "archiveStaff" && selectedStaff && (
          <ArchiveStaff
            isOpen={true}
            onClose={closeModal}
            onArchive={handleArchiveStaff}
            data-cy="archive-staff-modal"
          />
        )}
      </div>

      {/* Appointment details modal */}
      {showAppointmentModal && selectedAppointment && (
        <AppointmentDetails
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          appointmentData={selectedAppointment}
          onConfirm={handleConfirmAppointment}
          onReject={handleRejectAppointment}
        />
      )}
    </div>
  );
}

export default AdministratorDashboard;
