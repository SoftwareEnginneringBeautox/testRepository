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

  useEffect(() => {
    fetchStaff();
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

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 justify-center w-full p-3 sm:p-4 md:p-6 lg:w-[90%] mx-auto ">
      {showAlert && (
        <AlertContainer className="w-full">
          <InformationIcon />
          <AlertText>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </AlertText>
          <CloseAlert onClick={() => setShowAlert(false)}>&times;</CloseAlert>
        </AlertContainer>
      )}
      {/* Left Section */}
      <div className="w-full lg:w-3/4 flex flex-col gap-4 sm:gap-6 md:gap-8">
        <div className="flex items-center rounded-lg gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserAdminIcon size={24} className="sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, ADMINISTRATOR {userName.toUpperCase()}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-base sm:text-lg md:text-xl text-left font-semibold py-2 sm:py-4">
                  REMINDERS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base"
                  data-cy="reminder-item"
                >
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check 1
                </TableCell>
                <TableCell
                  className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base"
                  data-cy="reminder-item"
                >
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check 2
                </TableCell>
                <TableCell
                  className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base"
                  data-cy="reminder-item"
                >
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check 3
                </TableCell>
                <TableCell
                  className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base"
                  data-cy="reminder-item"
                >
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check 4
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div data-cy="sales-chart" className="w-full overflow-x-auto">
          <SalesChart chartData={chartData} chartConfig={chartConfig} />
        </div>

        <br />
      </div>
      {/* Right Section */}
      <div className="w-full lg:w-1/4 shadow-custom p-4 sm:p-6 md:p-8 lg:p-10 bg-ash-100 rounded-lg flex flex-col items-center gap-3 sm:gap-4 mt-4 lg:mt-0">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-[2rem] leading-tight sm:leading-[2.8rem] font-semibold">
          <UserIcon size={24} className="sm:w-8 sm:h-8" />
          STAFF LIST
        </h3>
        {loadingStaff ? (
          <p className="text-sm sm:text-base">Loading staff...</p>
        ) : errorStaff ? (
          <p className="text-red-500 text-sm sm:text-base">{errorStaff}</p>
        ) : staffList.length === 0 ? (
          <p className="text-sm sm:text-base">No staff found.</p>
        ) : (
          <div className="w-full max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            {staffList.map((staff, index) => (
              <div
                key={index}
                className="w-full flex justify-between border-2 border-reflexBlue-400 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-2"
                data-cy="staff-card"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-sm sm:text-base">
                    {staff.username}
                  </span>
                  {(staff.role === "receptionist" ||
                    staff.role === "aesthetician") && (
                    <span className="text-xs sm:text-sm text-gray-500 capitalize">
                      ({staff.role})
                    </span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        data-cy="edit-staff-btn"
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
                        data-cy="archive-staff-btn"
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
          />
        )}
        {currentModal === "modifyStaff" && selectedStaff && (
          <ModifyStaff
            isOpen={true}
            onClose={closeModal}
            entryData={selectedStaff}
            onSubmit={handleEditStaff}
          />
        )}

        {currentModal === "archiveStaff" && selectedStaff && (
          <ArchiveStaff
            isOpen={true}
            onClose={closeModal}
            onArchive={handleArchiveStaff}
          />
        )}
      </div>
    </div>
  );
}

export default AdministratorDashboard;
