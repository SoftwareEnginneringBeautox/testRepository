import React, { useState, useEffect } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import CreatePackage from "@/components/modals/CreatePackage";
import EditPackage from "@/components/modals/EditPackage";
import DeletePackage from "@/components/modals/DeletePackage";
import CreateTreatment from "@/components/modals/CreateTreatment";
// (Optional: Import EditTreatment and DeleteTreatment modals if implemented)
// import EditTreatment from "@/components/modals/EditTreatment";
// import DeleteTreatment from "@/components/modals/DeleteTreatment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { Button } from "@/components/ui/Button";

import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import PackageIcon from "../assets/icons/PackageIcon";
import EllipsisIcon from "../assets/icons/EllipsisIcon";
import UserIcon from "../assets/icons/UserIcon";
import UserIDIcon from "../assets/icons/UserIDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import EditIcon from "../assets/icons/EditIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";

import axios from "axios";

const API_BASE_URL = process.env.VITE_API_URL;

function AdministratorServices() {
  const { currentModal, openModal, closeModal } = useModal();

  // State for treatments and packages loaded from the database
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);

  // Fetch Treatments from /api/treatments
  const fetchTreatments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/treatments`, {
        withCredentials: true,
      });
      setTreatmentsData(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // Fetch Packages from /api/packages
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        withCredentials: true,
      });
      setPackagesData(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // Initial load for treatments and packages
  useEffect(() => {
    fetchTreatments();
    fetchPackages();
  }, []);

  return (
    <div className="flex flex-col gap-4 text-left w-[90%] mx-auto overflow-hidden">
      <h4 className="text-[2rem] leading-[44.8px] font-semibold">
        ADMINISTRATOR SERVICES
      </h4>

      {/* Treatments Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">TREATMENT ID</TableHead>
            <TableHead className="py-4 text-center">TREATMENT NAME</TableHead>
            <TableHead className="py-4 text-center">PRICE</TableHead>
            <TableHead className="py-4 text-center">
              <button className="flex items-center justify-center h-8 w-full">
                <SettingsIcon />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatmentsData.length > 0 ? (
            treatmentsData.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell className="py-4 text-center">{treatment.id}</TableCell>
                <TableCell className="py-4 text-center">{treatment.treatment_name}</TableCell>
                <TableCell className="py-4 text-center">₱{treatment.price}</TableCell>
                <TableCell className="py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => openModal("editTreatment")}>
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openModal("deleteTreatment")}>
                          <DeleteIcon />
                          <p className="font-semibold">Delete</p>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="py-4 text-center">
                No treatments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Button for Adding Treatments */}
      <div className="w-full flex justify-end gap-4 mb-[2%]">
        <Button onClick={() => openModal("createTreatment")}>
          <PlusIcon />
          ADD NEW TREATMENT
        </Button>
      </div>

      {/* Packages Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">PRODUCT ID</TableHead>
            <TableHead className="py-4 text-center">PACKAGE</TableHead>
            <TableHead className="py-4 text-center">TREATMENT</TableHead>
            <TableHead className="py-4 text-center">SESSIONS</TableHead>
            <TableHead className="py-4 text-center">PRICE</TableHead>
            <TableHead className="py-4 text-center">
              <button className="flex items-center justify-center h-8 w-full">
                <SettingsIcon />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packagesData.length > 0 ? (
            packagesData.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="py-4 text-center">{pkg.id}</TableCell>
                <TableCell className="py-4 text-center">{pkg.package_name}</TableCell>
                <TableCell className="py-4 text-center">{pkg.treatment}</TableCell>
                <TableCell className="py-4 text-center">{pkg.sessions}</TableCell>
                <TableCell className="py-4 text-center">₱{pkg.price}</TableCell>
                <TableCell className="py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => openModal("editPackage")}>
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openModal("deletePackage")}>
                          <DeleteIcon />
                          <p className="font-semibold">Delete</p>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="py-4 text-center">
                No packages found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full flex justify-end gap-4 mb-[10%]">
        <Button variant="outline">
          <ChevronLeftIcon />
          CHECK
        </Button>
        <Button onClick={() => openModal("createPackage")}>
          <PlusIcon />
          ADD NEW PACKAGE
          <PackageIcon />
        </Button>
      </div>

      {/* Modals */}
      {currentModal === "createPackage" && (
        <CreatePackage
          isOpen={true}
          onClose={() => {
            closeModal();
            fetchPackages();
          }}
        />
      )}
      {currentModal === "editPackage" && (
        <EditPackage isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "deletePackage" && (
        <DeletePackage isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "createTreatment" && (
        <CreateTreatment
          isOpen={true}
          onClose={() => {
            closeModal();
            fetchTreatments();
          }}
        />
      )}
      {/* Optionally, add modals for editing/deleting treatments */}
      {/* {currentModal === "editTreatment" && (
        <EditTreatment isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "deleteTreatment" && (
        <DeleteTreatment isOpen={true} onClose={closeModal} />
      )} */}
    </div>
  );
}

export default AdministratorServices;
