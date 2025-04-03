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

const API_BASE_URL = import.meta.env.VITE_API_URL

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
      await axios.post(`${API_BASE_URL}/api/manage-record`, {
        table: "accounts",
        id: updatedData.id,
        action: "edit",
        data: updatedData,
      }, {
        withCredentials: true,
      });
  
      closeModal();
      fetchStaff();
    } catch (error) {
      console.error("Error editing staff:", error);
    }
  };
  
  const handleArchiveStaff = async () => {
    if (!selectedStaff?.id) return;
  
    try {
      await axios.post(`${API_BASE_URL}/api/manage-record`, {
        table: "accounts",
        id: selectedStaff.id,
        action: "archive",
      }, {
        withCredentials: true,
      });
  
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
        withCredentials: true,
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
    <div className="flex flex-col md:flex-row items-start gap-6 justify-center w-full p-4 md:w-[90%] mx-auto mt-10">
      {showAlert && (
        <AlertContainer>
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
      <div className="w-full md:w-3/4 flex flex-col gap-8">
        <div className="flex items-center rounded-lg gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserAdminIcon size={32} />
          </div>
          <h2 className="text-xl md:text-[2rem] leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, ADMINISTRATOR {userName.toUpperCase()}
          </h2>
        </div>
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl text-left font-semibold py-4">
                REMINDERS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center gap-4">
                <CalendarIcon />
                Check 1
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <CalendarIcon />
                Check 2
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <CalendarIcon />
                Check 3
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <CalendarIcon />
                Check 4
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <SalesChart chartData={chartData} chartConfig={chartConfig} />
        <br />
      </div>
      {/* Right Section */}
      <div className="w-full md:w-1/4 shadow-custom p-6 md:p-10 bg-ash-100 rounded-lg flex flex-col items-center gap-4">
        <h3 className="flex items-center gap-2 text-xl md:text-[2rem] leading-[2.8rem] font-semibold">
          <UserIcon size={32} />
          STAFF LIST
        </h3>
        {loadingStaff ? (
          <p>Loading staff...</p>
        ) : errorStaff ? (
          <p className="text-red-500">{errorStaff}</p>
        ) : staffList.length === 0 ? (
          <p>No staff found.</p>
        ) : (
          staffList.map((staff, index) => (
            <div
              key={index}
              className="w-full flex justify-between border-2 border-reflexBlue-400 px-4 py-3 rounded-md"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{staff.username}</span>
                {(staff.role === "receptionist" ||
                  staff.role === "aesthetician") && (
                  <span className="text-sm text-gray-500 capitalize">
                    ({staff.role})
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedStaff(staff);
                      openModal("modifyStaff");
                    }}
                  >
                    <EditIcon />
                    <p className="font-semibold">Edit</p>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedStaff(staff);
                      openModal("archiveStaff");
                    }}
                  >
                    <ArchiveIcon />
                    <p className="font-semibold">Archive</p>
                  </DropdownMenuItem>

                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
        <Button fullWidth="true" onClick={() => openModal("createStaff")}>
          <PlusIcon />
          ADD NEW STAFF
          <UserIcon />
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
