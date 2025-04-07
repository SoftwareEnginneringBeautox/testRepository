import React, { useState, useEffect } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/Button";
import CreateStaff from "@/components/modals/CreateStaff";
import ModifyStaff from "@/components/modals/ModifyStaff";
import ArchiveStaff from "@/components/modals/ArchiveStaff";
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
import { format } from "date-fns";

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
  
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState(null);

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
  const fetchReminders = async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    const dayAfterTomorrow = new Date(today);
  
    tomorrow.setDate(today.getDate() + 1);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date) => date.toISOString().split("T")[0];

    console.log("Today:", formatDate(today));
    console.log("Checking for:", formatDate(tomorrow), "and", formatDate(dayAfterTomorrow));
  
    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments`, {
        withCredentials: true
      });
      const data = res.data || [];

      console.log("Fetched appointments:", data); 
      const filtered = data.filter((entry) => {
        console.log("Raw date_of_session:", entry.date_of_session); // ← ✅ ADD HERE

        const sessionDate = entry.date_of_session.slice(0, 10);
        console.log("Comparing:", sessionDate, "with", formatDate(tomorrow), "and", formatDate(dayAfterTomorrow));

        console.log("Session date:", sessionDate);
        return (
          sessionDate === formatDate(today) ||
          sessionDate === formatDate(tomorrow) ||
          sessionDate === formatDate(dayAfterTomorrow)
        );
      });
      console.log("Filtered reminders:", filtered); // ← ✅ PUT HERE

      setReminders(filtered);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };
  

  useEffect(() => {
    fetchStaff();
    fetchReminders();
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
              <TableRow>
              {reminders.length > 0 ? (
              reminders.map((item, index) => (
                <TableCell key={index} className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  {item.full_name} has an appointment on{" "}
                  <strong>{format(new Date(item.date_of_session), "MMMM dd, yyyy")}</strong>{" "}
                  at{" "}
                  <strong>
                    {format(new Date(`1970-01-01T${item.time_of_session}`), "hh:mm a")}
                  </strong>
                </span>
                {getReminderLabel(item.date_of_session) && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-lavender-300 text-white font-semibold">
                    {getReminderLabel(item.date_of_session)}
                  </span>
                )}
              </TableCell>
              ))
            ) : (
              <TableCell className="text-sm sm:text-base">
                No recent appointments needing reminders.
              </TableCell>
            )}
              </TableRow>
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
    </div>
  );
}

export default AdministratorDashboard;
