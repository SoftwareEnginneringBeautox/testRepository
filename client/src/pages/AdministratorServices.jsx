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

import { Badge } from "@/components/ui/Badge";

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

import { Loader } from "@/components/ui/Loader";

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AdministratorServices() {
  const { currentModal, openModal, closeModal } = useModal();

  // State for treatments and packages loaded from the database
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [loadingTreatments, setLoadingTreatments] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  // Fetch Treatments from /api/treatments
  const fetchTreatments = async () => {
    try {
      setLoadingTreatments(true);
      const response = await axios.get(`${API_BASE_URL}/api/treatments`, {
        withCredentials: true
      });
      setTreatmentsData(response.data.filter((item) => !item.archived));
    } catch (error) {
      console.error("Error fetching treatments:", error);
    } finally {
      setLoadingTreatments(false);
    }
  };

  // Fetch Packages from /api/packages
  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        withCredentials: true
      });
      setPackagesData(response.data.filter((item) => !item.archived));
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoadingPackages(false);
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

  const [treatmentsPage, setTreatmentsPage] = useState(1);
  const [packagesPage, setPackagesPage] = useState(1);
  const itemsPerPage = 10;

  // Add pagination calculations
  const paginatedTreatments = treatmentsData.slice(
    (treatmentsPage - 1) * itemsPerPage,
    treatmentsPage * itemsPerPage
  );
  const totalTreatmentPages = Math.ceil(treatmentsData.length / itemsPerPage);

  const paginatedPackages = packagesData.slice(
    (packagesPage - 1) * itemsPerPage,
    packagesPage * itemsPerPage
  );
  const totalPackagePages = Math.ceil(packagesData.length / itemsPerPage);

  const paginateTreatments = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalTreatmentPages) {
      setTreatmentsPage(pageNumber);
    }
  };

  const paginatePackages = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPackagePages) {
      setPackagesPage(pageNumber);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 text-left w-[90%] mx-auto overflow-hidden"
      data-cy="admin-services-container"
    >
      <h4
        className="text-[2rem] leading-[44.8px] font-semibold dark:text-customNeutral-100"
        data-cy="admin-services-title"
      >
        ADMINISTRATOR SERVICES
      </h4>

      {/* Treatments Table */}
      <Table
        data-cy="treatments-table"
        showPagination={true}
        currentPage={treatmentsPage}
        totalPages={totalTreatmentPages}
        onPageChange={paginateTreatments}
      >
        <TableHeader data-cy="treatments-table-header">
          <TableRow>
            <TableHead
              className="py-4 text-center"
              data-cy="treatment-id-header"
            >
              TREATMENT ID
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="treatment-name-header"
            >
              TREATMENT NAME
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="treatment-price-header"
            >
              PRICE
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="treatment-expiration-header"
            >
              EXPIRATION
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="treatment-actions-header"
            ></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-cy="treatments-table-body">
          {loadingTreatments ? (
            <TableRow>
              <TableCell
                colSpan="4"
                className="py-4 text-center font-medium"
                data-cy="loading-treatments-message"
              >
                LOADING TREATMENTS...
              </TableCell>
            </TableRow>
          ) : paginatedTreatments.length > 0 ? (
            paginatedTreatments.map((treatment) => (
              <TableRow
                key={treatment.id}
                data-cy={`treatment-row-${treatment.id}`}
              >
                <TableCell
                  className="py-4 text-center"
                  data-cy={`treatment-id-${treatment.id}`}
                >
                  {treatment.id}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`treatment-name-${treatment.id}`}
                >
                  {treatment.treatment_name.toUpperCase()}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`treatment-price-${treatment.id}`}
                >
                  ₱{treatment.price}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`treatment-expiration-${treatment.id}`}
                >
                  {treatment.expiration
                    ? `${treatment.expiration} WEEK${
                        treatment.expiration > 1 ? "S" : ""
                      }`
                    : "-"}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`treatment-actions-${treatment.id}`}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      data-cy={`treatment-actions-trigger-${treatment.id}`}
                    >
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      data-cy={`treatment-actions-content-${treatment.id}`}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          data-cy={`edit-treatment-btn-${treatment.id}`}
                          onClick={() => handleSelectTreatmentToEdit(treatment)}
                        >
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          data-cy={`archive-treatment-btn-${treatment.id}`}
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
              <TableCell
                colSpan="4"
                className="py-4 text-center"
                data-cy="no-treatments-message"
              >
                NO TREATMENTS FOUND.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Button for Adding Treatments */}
      <div
        className="w-full flex justify-end gap-4 mb-[2%]"
        data-cy="add-treatment-container"
      >
        <Button
          data-cy="add-treatment-btn"
          onClick={() => openModal("createTreatment")}
        >
          <PlusIcon />
          ADD NEW TREATMENT
        </Button>
      </div>

      {/* Packages Table */}
      <Table
        data-cy="packages-table"
        showPagination={true}
        currentPage={packagesPage}
        totalPages={totalPackagePages}
        onPageChange={paginatePackages}
      >
        <TableHeader data-cy="packages-table-header">
          <TableRow>
            <TableHead className="py-4 text-center" data-cy="package-id-header">
              PRODUCT ID
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-name-header"
            >
              PACKAGE
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-treatment-header"
            >
              TREATMENT
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-sessions-header"
            >
              SESSIONS
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-price-header"
            >
              PRICE
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-expiration-header"
            >
              EXPIRATION
            </TableHead>
            <TableHead
              className="py-4 text-center"
              data-cy="package-actions-header"
            ></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-cy="packages-table-body">
          {loadingPackages ? (
            <TableRow>
              <TableCell
                colSpan="6"
                className="py-4 text-center font-medium"
                data-cy="loading-packages-message"
              >
                LOADING PACKAGES...
              </TableCell>
            </TableRow>
          ) : paginatedPackages.length > 0 ? (
            paginatedPackages.map((pkg) => (
              <TableRow key={pkg.id} data-cy={`package-row-${pkg.id}`}>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-id-${pkg.id}`}
                >
                  {pkg.id}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-name-${pkg.id}`}
                >
                  {pkg.package_name.toUpperCase()}
                </TableCell>
                <TableCell
                  className="py-4 text-left"
                  data-cy={`package-treatments-${pkg.id}`}
                >
                  {treatmentsData.length > 0 &&
                  Array.isArray(pkg.treatment_ids) &&
                  pkg.treatment_ids.length > 0 ? (
                    <div
                      className="flex flex-col gap-1"
                      data-cy={`package-treatments-list-${pkg.id}`}
                    >
                      {pkg.treatment_ids.map((id) => {
                        const treatment = treatmentsData.find(
                          (t) => t.id === Number(id)
                        );
                        return treatment ? (
                          <Badge
                            key={treatment.id}
                            variant="outline"
                            data-cy={`package-treatment-badge-${pkg.id}-${treatment.id}`}
                          >
                            + {treatment.treatment_name.toUpperCase()}
                          </Badge>
                        ) : (
                          <span
                            key={id}
                            className="text-red-500 text-sm italic"
                            data-cy={`package-treatment-not-found-${pkg.id}-${id}`}
                          >
                            NOT FOUND: {id}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span
                      className="text-muted-foreground italic"
                      data-cy={`package-no-treatments-${pkg.id}`}
                    >
                      NO TREATMENTS FOUND
                    </span>
                  )}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-sessions-${pkg.id}`}
                >
                  {pkg.sessions}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-price-${pkg.id}`}
                >
                  ₱{pkg.price}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-expiration-${pkg.id}`}
                >
                  {pkg.expiration
                    ? `${pkg.expiration} WEEK${pkg.expiration > 1 ? "S" : ""}`
                    : "-"}
                </TableCell>
                <TableCell
                  className="py-4 text-center"
                  data-cy={`package-actions-${pkg.id}`}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      data-cy={`package-actions-trigger-${pkg.id}`}
                    >
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      data-cy={`package-actions-content-${pkg.id}`}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          data-cy={`edit-package-btn-${pkg.id}`}
                          onClick={() => handleSelectPackageToEdit(pkg)}
                        >
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          data-cy={`archive-package-btn-${pkg.id}`}
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
              <TableCell
                colSpan="6"
                className="py-4 text-center"
                data-cy="no-packages-message"
              >
                NO PACKAGES FOUND.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        className="w-full flex justify-end gap-4 mb-[10%]"
        data-cy="bottom-actions"
      >
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
          data-cy="create-package-modal"
        />
      )}
      {currentModal === "editPackage" && selectedPackage && (
        <EditPackage
          isOpen={true}
          onClose={closeModal}
          entryData={selectedPackage}
          onSubmit={handleEditPackage}
          data-cy="edit-package-modal"
        />
      )}
      {currentModal === "archivePackage" && selectedPackage && (
        <ArchivePackage
          isOpen={true}
          onClose={closeModal}
          entryData={selectedPackage}
          onArchive={handleArchivePackage}
          data-cy="archive-package-modal"
        />
      )}
      {currentModal === "createTreatment" && (
        <CreateTreatment
          isOpen={true}
          onClose={() => {
            closeModal();
            fetchTreatments();
          }}
          data-cy="create-treatment-modal"
        />
      )}
      {currentModal === "archiveTreatment" && selectedTreatment && (
        <ArchiveTreatment
          isOpen={true}
          onClose={closeModal}
          entryData={selectedTreatment}
          onArchive={handleArchiveTreatment}
          data-cy="archive-treatment-modal"
        />
      )}
      {currentModal === "editTreatment" && selectedTreatment && (
        <EditTreatment
          isOpen={true}
          onClose={closeModal}
          entryData={selectedTreatment}
          onSubmit={handleEditTreatment}
          data-cy="edit-treatment-modal"
        />
      )}
    </div>
  );
}

export default AdministratorServices;
