import React, { useState, useEffect } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/Button";
import CreateStaff from "@/components/modals/CreateStaff";
import ModifyStaff from "@/components/modals/ModifyStaff";
import DeleteStaff from "@/components/modals/DeleteStaff";
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
import InformationIcon from "../assets/icons/InformationIcon";
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
} from "@/components/ui/table";
import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";

function AdministratorDashboard() {
  const { currentModal, openModal, closeModal } = useModal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly");

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // State for dynamic staff list
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState(null);

  // Fetch staff from the database filtering for receptionist and aesthetician roles
  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await fetch("http://localhost:4000/getusers", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch staff");
        }
        const data = await response.json();
        // Filter to include only receptionist and aesthetician roles
        const filteredStaff = data.filter(
          (user) =>
            user.role === "receptionist" || user.role === "aesthetician"
        );
        setStaffList(filteredStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setErrorStaff(error.message);
      } finally {
        setLoadingStaff(false);
      }
    }
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

  return (
    <div className="flex items-start gap-12 justify-center w-[90%] mx-auto mt-10">
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
      <div className="w-3/4 flex flex-col gap-8">
        <div className="flex items-center rounded-lg gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserAdminIcon size={32} />
          </div>
          <h2 className="text-[2rem] leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, ADMINISTRATOR
          </h2>
        </div>
        <Table className="overflow-x-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl text-left font-semibold py-4 ">
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
        <SalesChart />
        <br />
      </div>
      <div className="w-1/4 shadow-custom p-10 bg-ash-100 rounded-lg h-auto flex flex-col items-center gap-4">
        <h3 className="flex items-center gap-2 text-[2rem] leading-[2.8rem] font-semibold">
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
              {staff.username}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => openModal("modifyStaff")}>
                      <EditIcon />
                      <p className="font-semibold">Edit</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal("deleteStaff")}>
                      <DeleteIcon />
                      <p className="font-semibold">Delete</p>
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
          <CreateStaff isOpen={true} onClose={closeModal} />
        )}
        {currentModal === "modifyStaff" && (
          <ModifyStaff
            isOpen={true}
            onClose={closeModal}
            staffList={staffList}
          />
        )}
        {currentModal === "deleteStaff" && (
          <DeleteStaff
            isOpen={currentModal === "deleteStaff"}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}

export default AdministratorDashboard;
