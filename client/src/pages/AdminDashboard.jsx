import React, { useState, useEffect } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/Button";
import CreateStaff from "@/components/modals/CreateStaff";
import ModifyStaff from "@/components/modals/ModifyStaff";
import ArchiveStaff from "@/components/modals/ArchiveStaff";
import AppointmentDetailsModal from "@/components/modals/AppointmentDetailsModal"; 
import SalesChart from "../components/SalesChart";
import PlusIcon from "../assets/icons/PlusIcon";
import UserIcon from "../assets/icons/UserIcon";
import UserAdminIcon from "../assets/icons/UserAdminIcon";
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
import CalendarIcon from "@/assets/icons/CalendarIcon";
import axios from "axios";
import { format, parseISO } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AdministratorDashboard() {
  const [userName, setUserName] = useState(
    localStorage.getItem("username") || ""
  );
  const { currentModal, openModal, closeModal } = useModal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const [reminders, setReminders] = useState([]);
  
  // Add state for staged appointments
  const [stagedAppointments, setStagedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState(null);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState(null);

  const [selectedStaff, setSelectedStaff] = useState(null);
  
  const handleEditStaff = async (updatedData) => {
    console.log("Sending to backend:", updatedData);
    try {
      await axios.post(
        `${API_BASE_URL}/api/manage-record`,
        {
          table: "accounts",
          id: updatedData.id,
          action: "edit",
          data: updatedData
        },
        {
          withCredentials: true
        }
      );

      closeModal();
      fetchStaff();
    } catch (error) {
      console.error("Error editing staff:", error);
    }
  };

  const handleArchiveStaff = async () => {
    if (!selectedStaff?.id) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/manage-record`,
        {
          table: "accounts",
          id: selectedStaff.id,
          action: "archive"
        },
        {
          withCredentials: true
        }
      );

      closeModal();
      fetchStaff();
    } catch (error) {
      console.error("Error archiving staff:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const response = await axios.get(`${API_BASE_URL}/getusers`, {
        withCredentials: true
      });
      console.log("Raw staff response:", response.data);

      const data = response.data;
      const filteredStaff = data.filter(
        (user) =>
          (user.role === "receptionist" || user.role === "aesthetician") &&
          !user.archived // ✅ only include unarchived staff
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
  
  const fetchStagedAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setAppointmentError(null);
      
      const res = await axios.get(`${API_BASE_URL}/api/staged-appointments/unconfirmed`, {
        withCredentials: true
      });
      
      console.log("Fetched staged appointments:", res.data);
      
      // Make sure we have data and it's an array
      if (res.data && Array.isArray(res.data)) {
        // Ensure all records have required fields for rendering
        const validatedData = res.data.map(appointment => ({
          ...appointment,
          // Make sure date_of_session is a string
          date_of_session: appointment.date_of_session || '2025-01-01',
          // Make sure time_of_session is a string
          time_of_session: appointment.time_of_session || '00:00:00',
          // Make sure full_name is a string
          full_name: appointment.full_name || 'Unknown Client'
        }));
        
        setStagedAppointments(validatedData);
        console.log("Validated staged appointments:", validatedData);
      } else {
        console.warn("Invalid staged appointments data:", res.data);
        setStagedAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching staged appointments:", error);
      setAppointmentError("Failed to load staged appointments");
    } finally {
      setLoadingAppointments(false);
    }
  };
  
  const handleConfirmAppointment = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/staged-appointments/${id}/confirm`, {}, {
        withCredentials: true
      });
      
      alert("Appointment confirmed successfully!");
      setShowAppointmentModal(false);
      fetchStagedAppointments(); // Refresh the list
      fetchReminders(); // Refresh regular appointments
    } catch (error) {
      console.error("Error confirming appointment:", error);
      alert("Failed to confirm appointment");
    }
  };
  
  const handleRejectAppointment = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/staged-appointments/${id}/reject`, {}, {
        withCredentials: true
      });
      
      alert("Appointment rejected");
      setShowAppointmentModal(false);
      fetchStagedAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      alert("Failed to reject appointment");
    }
  };
  
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };
  
  const fetchReminders = async () => {
    try {
      setLoadingAppointments(true);
      setAppointmentError(null);
      
      const res = await axios.get(`${API_BASE_URL}/api/appointments`, {
        withCredentials: true
      });
      
      console.log("Fetched appointments:", res.data);
      
      if (res.data && Array.isArray(res.data)) {
        const today = new Date();
        const tomorrow = new Date(today);
        const dayAfterTomorrow = new Date(today);
      
        tomorrow.setDate(today.getDate() + 1);
        dayAfterTomorrow.setDate(today.getDate() + 2);
    
        const formatDate = (date) => date.toISOString().split("T")[0];
    
        console.log("Today:", formatDate(today));
        console.log("Checking for:", formatDate(tomorrow), "and", formatDate(dayAfterTomorrow));
        
        const filtered = res.data.filter((entry) => {
          // Ensure date_of_session exists and is a string
          if (!entry.date_of_session || typeof entry.date_of_session !== 'string') {
            console.warn("Invalid date format for entry:", entry);
            return false;
          }
          
          const sessionDate = entry.date_of_session.slice(0, 10);
          
          return (
            sessionDate === formatDate(today) ||
            sessionDate === formatDate(tomorrow) ||
            sessionDate === formatDate(dayAfterTomorrow)
          );
        });
        
        console.log("Filtered reminders:", filtered);
        setReminders(filtered);
      } else {
        console.warn("Invalid appointments data:", res.data);
        setReminders([]);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setAppointmentError("Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchReminders();
    fetchStagedAppointments(); // Fetch staged appointments
  }, []);

  const [showAlert, setShowAlert] = useState(false);

  const throwAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 15000);
  };

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

  const chartData = [
    { day: "Mon", currentWeek: 1300, previousWeek: 1100 },
    { day: "Tue", currentWeek: 1400, previousWeek: 1150 },
    { day: "Wed", currentWeek: 1500, previousWeek: 1200 },
    { day: "Thu", currentWeek: 1600, previousWeek: 1250 },
    { day: "Fri", currentWeek: 1700, previousWeek: 1300 },
    { day: "Sat", currentWeek: 1800, previousWeek: 1350 },
    { day: "Sun", currentWeek: 1900, previousWeek: 1400 }
  ];

  const chartConfig = {
    currentWeek: {
      label: "Current Week",
      color: "#381B4C"
    },
    previousWeek: {
      label: "Previous Week",
      color: "#002B7F"
    }
  };
  
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
  
  return (
    <div
      className="flex flex-col lg:flex-row items-start gap-6 justify-center w-full p-3 sm:p-4 md:p-6 lg:w-[90%] mx-auto"
      data-cy="admin-dashboard-container"
    >
      {showAlert && (
        <AlertContainer className="w-full" data-cy="alert-container">
          <InformationIcon />
          <AlertText data-cy="alert-text">
            <AlertTitle data-cy="alert-title">Heads up!</AlertTitle>
            <AlertDescription data-cy="alert-description">
              You can add components to your app using the CLI.
            </AlertDescription>
          </AlertText>
          <CloseAlert onClick={() => setShowAlert(false)} data-cy="close-alert">
            &times;
          </CloseAlert>
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
        <div className="overflow-x-auto" data-cy="reminders-table-container">
          <Table className="min-w-full" data-cy="reminders-table">
            <TableHeader data-cy="reminders-header">
              <TableRow>
                <TableHead
                  className="text-base sm:text-lg md:text-xl text-left font-semibold py-2 sm:py-4"
                  data-cy="reminders-title"
                >
                  REMINDERS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-cy="reminders-body">
              {loadingAppointments ? (
                <TableRow>
                  <TableCell>
                    Loading appointments...
                  </TableCell>
                </TableRow>
              ) : appointmentError ? (
                <TableRow>
                  <TableCell className="text-red-500">
                    {appointmentError}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Display any pending appointment confirmations */}
                  {stagedAppointments.length > 0 ? (
                    stagedAppointments.map((item, index) => (
                      <TableRow key={`staged-${index}`}>
                        <TableCell className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
                          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>
                            <strong>{item.full_name}</strong> has scheduled an appointment on{" "}
                            <strong>{formatSafeDate(item.date_of_session, "MMMM dd, yyyy")}</strong>{" "}
                            at{" "}
                            <strong>
                              {formatSafeTime(item.time_of_session)}
                            </strong>
                          </span>
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-lavender-300 text-white font-semibold">
                            Needs Confirmation
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-auto"
                            onClick={() => viewAppointmentDetails(item)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : null}
                  
                  {/* Display existing reminders for confirmed appointments */}
                  {reminders.length > 0 ? (
                    reminders.map((item, index) => (
                      <TableRow key={`reminder-${index}`}>
                        <TableCell className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
                          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>
                            {item.full_name} has an appointment on{" "}
                            <strong>{formatSafeDate(item.date_of_session, "MMMM dd, yyyy")}</strong>{" "}
                            at{" "}
                            <strong>
                              {formatSafeTime(item.time_of_session)}
                            </strong>
                          </span>
                          {getReminderLabel(item.date_of_session) && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-lavender-300 text-white font-semibold">
                              {getReminderLabel(item.date_of_session)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    (!stagedAppointments.length && (
                      <TableRow>
                        <TableCell className="text-sm sm:text-base">
                          No recent appointments needing reminders.
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div data-cy="sales-chart-container">
          <SalesChart
            chartData={chartData}
            chartConfig={chartConfig}
            data-cy="sales-chart"
          />
        </div>
      </div>

      {/* Right Section */}
      <div
        className="w-full lg:w-1/4 shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 rounded-lg flex flex-col items-center gap-3 sm:gap-4 mt-4 lg:mt-0"
        data-cy="staff-section"
      >
        <h3
          className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold"
          data-cy="staff-list-title"
        >
          <UserIcon size={24} className="sm:w-8 sm:h-8" data-cy="staff-icon" />
          STAFF LIST
        </h3>
        {loadingStaff ? (
          <p className="text-sm sm:text-base" data-cy="loading-staff-message">
            Loading staff...
          </p>
        ) : errorStaff ? (
          <p
            className="text-red-500 text-sm sm:text-base"
            data-cy="staff-error-message"
          >
            {errorStaff}
          </p>
        ) : staffList.length === 0 ? (
          <p className="text-sm sm:text-base" data-cy="no-staff-message">
            No staff found.
          </p>
        ) : (
          <div
            className="w-full max-h-[300px] sm:max-h-[400px] overflow-y-auto"
            data-cy="staff-list-container"
          >
            {staffList.map((staff, index) => (
              <div
                key={index}
                className="w-full flex justify-between border-2 border-reflexBlue-400 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-2"
                data-cy={`staff-card-${index}`}
              >
                <div className="flex flex-col" data-cy={`staff-info-${index}`}>
                  <span
                    className="font-semibold text-sm sm:text-base"
                    data-cy={`staff-name-${index}`}
                  >
                    {staff.username}
                  </span>
                  {(staff.role === "receptionist" ||
                    staff.role === "aesthetician") && (
                    <span
                      className="text-xs sm:text-sm text-gray-500 capitalize"
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
                    <EllipsisIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-cy={`staff-actions-content-${index}`}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        data-cy={`edit-staff-btn-${index}`}
                        onClick={() => {
                          setSelectedStaff(staff);
                          openModal("modifyStaff");
                        }}
                      >
                        <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="font-semibold text-sm sm:text-base">
                          Edit
                        </p>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        data-cy={`archive-staff-btn-${index}`}
                        onClick={() => {
                          setSelectedStaff(staff);
                          openModal("archiveStaff");
                        }}
                      >
                        <ArchiveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          onClick={() => openModal("createStaff")}
          className="mt-2 text-sm sm:text-base py-2 sm:py-3"
        >
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          ADD NEW STAFF
          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
        <AppointmentDetailsModal
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