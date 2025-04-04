import React, { useState, useEffect } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import CreatePackage from "@/components/modals/CreatePackage";
import EditPackage from "@/components/modals/EditPackage";
import ArchivePackage from "@/components/modals/ArchivePackage";
import CreateTreatment from "@/components/modals/CreateTreatment";
// (Optional: Import EditTreatment and DeleteTreatment modals if implemented)
import EditTreatment from "@/components/modals/EditTreatment";
import ArchiveTreatment from "@/components/modals/ArchiveTreatment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

import { Button } from "@/components/ui/Button";

import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import PackageIcon from "../assets/icons/PackageIcon";
import EllipsisIcon from "../assets/icons/EllipsisIcon";
import UserIcon from "../assets/icons/UserIcon";
import UserIDIcon from "../assets/icons/UserIDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ArchiveIcon from "../assets/icons/ArchiveIcon";
import EditIcon from "../assets/icons/EditIcon";

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AdministratorServices() {
  const { currentModal, openModal, closeModal } = useModal();

  // State for treatments and packages loaded from the database
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  // Fetch Treatments from /api/treatments
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

  // Fetch Packages from /api/packages
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

  const handleSelectPackageToArchive = (pkg) => {
    setSelectedPackage(pkg);
    openModal("archivePackage");
  };

  const handleSelectPackageToEdit = (pkg) => {
    setSelectedPackage(pkg);
    openModal("editPackage");
  };

  const handleSelectTreatmentToArchive = (treatment) => {
    setSelectedTreatment(treatment);
    openModal("archiveTreatment");
  };

  const handleSelectTreatmentToEdit = (treatment) => {
    setSelectedTreatment(treatment);
    openModal("editTreatment");
  };

  const handleEditPackage = async (updatedData) => {
    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "packages",
        id: updatedData.id,
        action: "edit",
        data: updatedData
      })
    });

    closeModal();
    fetchPackages();
  };

  const handleArchivePackage = async () => {
    console.log("ARCHIVE BUTTON CLICKED", selectedPackage?.id);

    if (!selectedPackage?.id) return;

    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "packages",
        id: selectedPackage.id,
        action: "archive"
      })
    });

    closeModal();
    fetchPackages();
  };

  const handleEditTreatment = async (updatedData) => {
    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "treatments",
        id: updatedData.id,
        action: "edit",
        data: updatedData
      })
    });

    closeModal();
    fetchTreatments();
  };

  const handleArchiveTreatment = async () => {
    console.log("ARCHIVE BUTTON CLICKED", selectedTreatment?.id);

    if (!selectedTreatment?.id) return;

    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "treatments",
        id: selectedTreatment.id,
        action: "archive"
      })
    });

    closeModal();
    fetchTreatments();
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
      <Table data-cy="treatment-table">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">TREATMENT ID</TableHead>
            <TableHead className="py-4 text-center">TREATMENT NAME</TableHead>
            <TableHead className="py-4 text-center">PRICE</TableHead>
            <TableHead className="py-4 text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {treatmentsData.length > 0 ? (
            treatmentsData.map((treatment) => (
              <TableRow data-cy="treatment-row" key={treatment.id}>
                <TableCell className="py-4 text-center">
                  {treatment.id}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {treatment.treatment_name}
                </TableCell>
                <TableCell className="py-4 text-center">
                  ₱{treatment.price}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          data-cy="edit-treatment-btn"
                          onClick={() => handleSelectTreatmentToEdit(treatment)}
                        >
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          data-cy="archive-treatment-btn"
                          onClick={() =>
                            handleSelectTreatmentToArchive(treatment)
                          }
                        >
                          <ArchiveIcon />
                          <p className="font-semibold">Archive</p>
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
        <Button
          data-cy="add-treatment-btn"
          onClick={() => openModal("createTreatment")}
        >
          <PlusIcon />
          ADD NEW TREATMENT
        </Button>
      </div>

      {/* Packages Table */}
      <Table data-cy="package-table">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">PRODUCT ID</TableHead>
            <TableHead className="py-4 text-center">PACKAGE</TableHead>
            <TableHead className="py-4 text-center">TREATMENT</TableHead>
            <TableHead className="py-4 text-center">SESSIONS</TableHead>
            <TableHead className="py-4 text-center">PRICE</TableHead>
            <TableHead className="py-4 text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packagesData.length > 0 ? (
            packagesData.map((pkg) => (
              <TableRow data-cy="package-row" key={pkg.id}>
                <TableCell className="py-4 text-center">{pkg.id}</TableCell>
                <TableCell className="py-4 text-center">
                  {pkg.package_name}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {pkg.treatment}
                </TableCell>
                <TableCell className="py-4 text-center">
                  {pkg.sessions}
                </TableCell>
                <TableCell className="py-4 text-center">₱{pkg.price}</TableCell>
                <TableCell className="py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          data-cy="edit-package-btn"
                          onClick={() => handleSelectPackageToEdit(pkg)}
                        >
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          data-cy="archive-package-btn"
                          onClick={() => handleSelectPackageToArchive(pkg)}
                        >
                          <ArchiveIcon />
                          <p className="font-semibold">Archive</p>
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
        <Button
          data-cy="add-package-btn"
          onClick={() => openModal("createPackage")}
        >
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
      {currentModal === "editPackage" && selectedPackage && (
        <EditPackage
          isOpen={true}
          onClose={closeModal}
          entryData={selectedPackage}
          onSubmit={handleEditPackage}
        />
      )}
      {currentModal === "archivePackage" && selectedPackage && (
        <ArchivePackage
          isOpen={true}
          onClose={closeModal}
          entryData={selectedPackage}
          onArchive={handleArchivePackage}
        />
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
      {currentModal === "archiveTreatment" && selectedTreatment && (
        <ArchiveTreatment
          isOpen={true}
          onClose={closeModal}
          entryData={selectedTreatment}
          onArchive={handleArchiveTreatment}
        />
      )}

      {currentModal === "editTreatment" && selectedTreatment && (
        <EditTreatment
          isOpen={true}
          onClose={closeModal}
          entryData={selectedTreatment}
          onSubmit={handleEditTreatment}
        />
      )}
    </div>
  );
}

export default AdministratorServices;
