import React from "react";
import "../App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import SalesChart from "../components/SalesChart";
import PlusIcon from "../assets/icons/PlusIcon";
import UserIcon from "../assets/icons/UserIcon";
import UserAdminIcon from "../assets/icons/UserAdminIcon";

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

  // Load data on component mount
  useEffect(() => {
    fetchPackages();
    fetchTreatments();
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

  const events = [
    {
      day: "WED",
      startTime: "9:00AM",
      endTime: "10:30AM",
      name: "Alice Alex",
      description: "Me So Sexy Package"
    },
    {
      day: "FRI",
      startTime: "5:00PM",
      endTime: "6:00PM",
      name: "Violet Jessica",
      description: "Brazilian"
    }
  ];

  const currentStaff = [
    "Jessica Simpson",
    "Alice Alex",
    "Violet Jessica",
    "Patrick Star "
  ];

  const [showAlert, setShowAlert] = useState(false);

  const throwAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 15000);
  };

  return (
    <div className="flex items-start gap-12 justify-center w-[90%] mx-auto">
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center rounded-lg gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-reflexBlue-400 to-lavender-300 text-customNeutral-100 rounded-lg flex items-center justify-center">
            <UserIcon size={32} />
          </div>
          <h2 className="text-[2rem] leading-[2.8rem] font-semibold bg-gradient-to-r from-lavender-300 to-reflexBlue-400 text-transparent bg-clip-text">
            WELCOME BACK, {userName.toUpperCase()}
          </h2>
        </div>
        <Table>
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
        
        {/* Packages Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl text-center font-semibold py-4">
                PRODUCT ID
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                PACKAGE
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                TREATMENTS
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                SESSIONS
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                PRICE
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                EXPIRATION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packagesData.length > 0 ? (
              packagesData.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="text-center">
                    {pkg.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {pkg.package_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {treatmentsData.length > 0 &&
                    Array.isArray(pkg.treatment_ids) &&
                    pkg.treatment_ids.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {pkg.treatment_ids.map((id) => {
                          const treatment = treatmentsData.find(
                            (t) => t.id === Number(id)
                          );
                          return treatment ? (
                            <Badge
                              key={treatment.id}
                              variant="outline"
                            >
                              + {treatment.treatment_name}
                            </Badge>
                          ) : (
                            <span
                              key={id}
                              className="text-red-500 text-sm italic"
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
                  <TableCell className="text-center">
                    ₱{pkg.price}
                  </TableCell>
                  <TableCell className="text-center">
                    {pkg.expiration ? `${pkg.expiration} week${pkg.expiration > 1 ? "s" : ""}` : "-"}
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
        
        {/* Treatments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl text-center font-semibold py-4">
                TREATMENT ID
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                TREATMENT NAME
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
                PRICE
              </TableHead>
              <TableHead className="text-xl text-center font-semibold py-4">
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
                    {treatment.expiration ? `${treatment.expiration} week${treatment.expiration > 1 ? "s" : ""}` : "-"}
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
        <br />
      </div>
    </div>
  );
}

export default StaffDashboard;