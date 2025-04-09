import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import SortIcon from "@/assets/icons/SortIcon";
import MagnifyingGlassIcon from "@/assets/icons/MagnifyingGlassIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

import { InputTextField, Input } from "@/components/ui/Input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select";

import MultiSelectFilter from "@/components/ui/MultiSelectFilter";

// Import Pagination components from shadcn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/Pagination";

import CreatePatientEntry from "@/components/modals/CreatePatientEntry";
import EditPatientEntry from "@/components/modals/EditPatientEntry";
import UpdatePatientEntry from "@/components/modals/UpdatePatientEntry";
import ArchivePatientEntry from "@/components/modals/ArchivePatientEntry";

// Import date-fns for date formatting
import { format } from "date-fns";
import FilterIcon from "@/assets/icons/FilterIcon";
import UpdateIcon from "@/assets/icons/UpdateIcon";

// Add Checkbox import at the top of the file
import { Checkbox } from "@/components/ui/Checkbox";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // State for managing column visibility
  const [selectedColumns, setSelectedColumns] = useState([
    "client", // Mandatory
    "dateofsession", // Mandatory
    "timeofsession",
    "personincharge",
    "package",
    "treatment",
    "consentformsigned",
    "paymentmethod",
    "totalamount",
    "amountpaid",
    "remainingbalance",
    "referenceno",
    "contactnumber", // ✅ NEW
    "age", // ✅ NEW
    "email"
  ]);

  // State for temp column selection (before applying)
  const [tempSelectedColumns, setTempSelectedColumns] = useState([
    ...selectedColumns
  ]);

  const columns = [
    { label: "CLIENT", value: "client", mandatory: true },

    { label: "DATE OF SESSION", value: "dateofsession", mandatory: true },
    { label: "TIME OF SESSION", value: "timeofsession" },
    { label: "CONTACT NUMBER", value: "contactnumber" },
    { label: "AGE", value: "age" },
    { label: "EMAIL", value: "email" },
    { label: "PERSON IN CHARGE", value: "personincharge" },
    { label: "PACKAGE", value: "package" },
    { label: "TREATMENT", value: "treatment" },
    { label: "CONSENT FORM SIGNED", value: "consentformsigned" },
    { label: "PAYMENT METHOD", value: "paymentmethod" },
    { label: "TOTAL AMOUNT", value: "totalamount" },
    { label: "AMOUNT PAID", value: "amountpaid" },
    { label: "REMAINING BALANCE", value: "remainingbalance" },
    { label: "REFERENCE NO.", value: "referenceno" }
  ];

  // Handle applying column filter changes
  const applyColumnFilters = () => {
    // Ensure mandatory columns are included
    const mandatoryColumns = columns
      .filter((col) => col.mandatory)
      .map((col) => col.value);

    const updatedColumns = [...tempSelectedColumns];

    // Add any missing mandatory columns
    mandatoryColumns.forEach((mandatoryCol) => {
      if (!updatedColumns.includes(mandatoryCol)) {
        updatedColumns.push(mandatoryCol);
      }
    });

    setSelectedColumns(updatedColumns);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    console.log(
      "📅 Client date today:",
      new Date().toISOString().split("T")[0]
    );
  }, []);

  // Fetch patient records from the API
  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      console.log("API Response Data:", data); // 🔍 Debugging line
      setRecords(data.filter((record) => !record.archived)); // only show active records
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);
  const [treatmentsList, setTreatmentsList] = useState([]);
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/treatments?archived=false`,
          {
            credentials: "include"
          }
        );
        const data = await res.json();
        setTreatmentsList(data);
      } catch (err) {
        console.error("Error fetching treatments:", err);
      }
    };

    fetchTreatments();
  }, []);

  // Initialize the temporary column selection
  useEffect(() => {
    setTempSelectedColumns([...selectedColumns]);
  }, [selectedColumns]);

  const getTreatmentNames = (ids) => {
    if (!Array.isArray(ids)) return [];

    return ids
      .map((id) => {
        const treatment = treatmentsList.find((t) => t.id === id);
        return treatment?.treatment_name;
      })
      .filter(Boolean);
  };

  // Refresh data when a modal closes
  const handleModalClose = () => {
    closeModal();
    fetchRecords();
  };

  // Open update entry modal
  const handleOpenUpdateEntry = (record) => {
    setSelectedEntry(record);
    openModal("updateEntry");
  };

  // Open edit entry modal
  const handleOpenEditEntry = (record) => {
    setSelectedEntry(record);
    openModal("editEntry");
  };

  // Open archive entry modal
  const handleOpenArchiveEntry = (record) => {
    setSelectedEntry(record);
    openModal("archiveEntry");
  };

  const handleArchive = async () => {
    console.log("ARCHIVE BUTTON CLICKED", selectedEntry.id);
    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "patient_records",
        id: selectedEntry.id,
        action: "archive"
      })
    });
    closeModal();
    fetchRecords();
  };

  const sanitizeData = (data) => {
    const cleaned = { ...data };
    if (cleaned.total_amount === "") cleaned.total_amount = null;
    if (cleaned.payment_method === "") cleaned.payment_method = null;
    if (cleaned.treatment === "") cleaned.treatment = null;
    if (cleaned.person_in_charge === "") cleaned.person_in_charge = null;
    return cleaned;
  };

  const handleEditPatientEntry = async (updatedData) => {
    const safeData = sanitizeData(updatedData);
    console.log("✏️ Sent data:", safeData);
    await fetch(`${API_BASE_URL}/api/manage-record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        table: "patient_records",
        id: updatedData.id,
        action: "edit",
        data: safeData
      })
    });

    try {
      const appointmentPayload = {
        full_name: updatedData.patient_name,
        contact_number: updatedData.contact_number,
        age: updatedData.age ? parseInt(updatedData.age) : null,
        email: updatedData.email,
        date_of_session: updatedData.date_of_session,
        time_of_session: updatedData.time_of_session
      };

      await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST", // or PUT if your backend handles updates
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(appointmentPayload)
      });
    } catch (err) {
      console.error("❌ Failed to update appointment record:", err);
    }

    closeModal();
    fetchRecords();
  };

  const handleUpdatePatientEntry = async (updatedData) => {
    const safeData = sanitizeData(updatedData);
    console.log("🔁 Sent updated data:", safeData);
    try {
      await fetch(`${API_BASE_URL}/api/manage-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          table: "patient_records",
          id: updatedData.id,
          action: "edit", // or "update" if your backend expects a different action
          data: safeData
        })
      });
      closeModal();
      fetchRecords();
    } catch (error) {
      console.error("❌ Failed to update patient entry:", error);
    }
  };

  // Replace the existing handlePaidChange function
  const handlePaidChange = async (record, checked) => {
    try {
      console.log("Updating paid status:", {
        id: record.id,
        newStatus: checked ? "yes" : "no"
      });

      // Store local copy of updated record for optimistic updates
      const updatedRecord = {
        ...record,
        isPaid: checked ? "yes" : "no"
      };

      // Update UI immediately (optimistic update)
      setRecords(records.map((r) => (r.id === record.id ? updatedRecord : r)));

      // 1. Update patient record's paid status
      const updateResponse = await fetch(`${API_BASE_URL}/api/manage-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          table: "patient_records",
          id: record.id,
          action: "edit",
          data: { isPaid: checked ? "yes" : "no" }
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Error updating paid status: ${updateResponse.status}`);
      }

      // 2. If marking as paid, add to sales tracker
      if (checked) {
        // Sales tracker code remains unchanged
        const salesData = {
          client: record.client || record.patient_name,
          date_transacted: record.date_of_session,
          payment: record.amount_paid || record.total_amount,
          reference_no: record.reference_number,
          person_in_charge: record.person_in_charge,
          payment_method: record.payment_method,
          packages: record.package_name,
          treatment: record.treatment_ids
            ? getTreatmentNames(record.treatment_ids).join(", ")
            : ""
        };

        const salesResponse = await fetch(`${API_BASE_URL}/api/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(salesData)
        });

        if (!salesResponse.ok) {
          throw new Error(
            `Error adding to sales tracker: ${salesResponse.status}`
          );
        }
      }

      // Always fetch records to ensure UI is updated with server data
      await fetchRecords();
      console.log("Paid status updated successfully");
    } catch (error) {
      console.error("Error updating paid status:", error);
      // Revert the optimistic update by fetching fresh data
      fetchRecords();
      // You could add a toast notification here
    }
  };

  const filteredRecords = [...records]
    .filter((record) => {
      const name = record.client || record.patient_name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === "alphabetical") {
        const nameA = (a.client || a.patient_name || "").toLowerCase();
        const nameB = (b.client || b.patient_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortOption === "date") {
        const dateA = new Date(a.dateTransacted || a.date_of_session);
        const dateB = new Date(b.dateTransacted || b.date_of_session);
        return dateB - dateA; // Most recent first
      }
      return 0;
    });

  // Calculate pagination info
  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Get current page records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Change page function
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate pagination links
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => paginate(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Calculate range of visible pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the beginning or end
    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const generatePRDReport = (patientRecords) => {
    if (!patientRecords || patientRecords.length === 0) {
      console.error("No records available to generate PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    doc.setFont("helvetica");

    const margin = 36;
    const pageWidth = doc.internal.pageSize.width;
    const startY = margin + 10;

    const currentDate = new Date();
    const formattedCurrentDate = format(
      currentDate,
      "MMMM dd, yyyy"
    ).toUpperCase();
    const formattedDateForFilename = format(currentDate, "MMMM dd, yyyy");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `BEAUTOX PATIENT RECORDS REPORT AS OF ${formattedCurrentDate}`,
      pageWidth / 2,
      margin,
      { align: "center" }
    );

    const headers = [
      "CLIENT",
      "DATE OF SESSION",
      "TIME OF SESSION",
      "CONTACT NUMBER",
      "AGE",
      "EMAIL",
      "PERSON IN CHARGE",
      "PACKAGE",
      "TREATMENT",
      "CONSENT STATUS",
      "PAYMENT METHOD",
      "TOTAL AMOUNT",
      "AMOUNT PAID",
      "REMAINING BALANCE",
      "REFERENCE NO.",
      "PAID"
    ];

    const formatDate = (date) =>
      date ? format(new Date(date), "MMMM dd, yyyy").toUpperCase() : "N/A";
    const formatTime = (time) => {
      if (!time) return "N/A";
      const dateObj = new Date(`1970-01-01T${time}`);
      return format(dateObj, "hh:mm a").toUpperCase();
    };

    const tableData = patientRecords.map((record) => {
      const total = parseFloat(record.total_amount ?? "0");
      const paid = parseFloat(record.amount_paid || 0);
      const remaining = total - paid;
      const isPaidDisplay =
        record.isPaid === null || record.isPaid === undefined
          ? "-"
          : record.isPaid.toUpperCase();

      return [
        record.client || record.patient_name?.toUpperCase() || "N/A",
        formatDate(record.dateTransacted || record.date_of_session),
        formatTime(record.nextSessionTime || record.time_of_session),
        record.contact_number || "N/A",
        record.age || "N/A",
        record.email || "N/A",
        (record.personInCharge || record.person_in_charge)?.toUpperCase() ||
          "N/A",
        (record.package || record.package_name)?.toUpperCase() || "N/A",
        Array.isArray(record.treatments)
          ? getTreatmentNames(record.treatments).join(", ").toUpperCase()
          : record.treatment?.toUpperCase() || "N/A",
        typeof record.consent_form_signed === "boolean"
          ? record.consent_form_signed
            ? "SIGNED"
            : "NOT SIGNED"
          : record.consentStatus || "N/A",
        (record.paymentMethod || record.payment_method)?.toUpperCase() || "N/A",
        `PHP ${total.toFixed(2)}`,
        `PHP ${paid.toFixed(2)}`,
        `PHP ${remaining.toFixed(2)}`,
        record.reference_number || "N/A",
        isPaidDisplay
      ];
    });

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY + 20,
      margin: { top: margin, left: margin, right: margin, bottom: margin },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        valign: "middle",
        cellPadding: { top: 5, right: 5, bottom: 5, left: 5 }
      },
      headStyles: {
        fillColor: "#381B4C",
        textColor: "#FFFFFF",
        fontSize: 12,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: "#000000"
      },
      bodyStyles: {
        valign: "middle",
        lineWidth: 0.2,
        lineColor: "#000000"
      }
    });

    doc.save(
      `Beautox_PatientRecordsReport_${formattedDateForFilename
        .replace(/,\s/g, "_")
        .replace(/\s/g, "_")}.pdf`
    );
  };

  // Column mapping to determine visibility
  const isColumnVisible = {
    client: true, // Always true - mandatory
    dateofsession: true, // Always true - mandatory
    timeofsession: selectedColumns.includes("timeofsession"),
    contactnumber: selectedColumns.includes("contactnumber"),
    age: selectedColumns.includes("age"),
    email: selectedColumns.includes("email"),
    personincharge: selectedColumns.includes("personincharge"),
    package: selectedColumns.includes("package"),
    treatment: selectedColumns.includes("treatment"),
    consentformsigned: selectedColumns.includes("consentformsigned"),
    paymentmethod: selectedColumns.includes("paymentmethod"),
    totalamount: selectedColumns.includes("totalamount"),
    amountpaid: selectedColumns.includes("amountpaid"),
    remainingbalance: selectedColumns.includes("remainingbalance"),
    referenceno: selectedColumns.includes("referenceno"),
    paid: true // Always show paid status
  };

  return (
    <div
      className="flex flex-col gap-4 md:gap-[1.5rem] text-left w-full md:w-[90%] mx-auto px-4 md:px-0"
      data-cy="patient-records-database"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h4
          className="font-semibold dark:text-customNeutral-100 text-xl md:text-[2rem] leading-normal md:leading-[2.8rem]"
          data-cy="patient-records-title"
        >
          PATIENT RECORDS
        </h4>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 w-full md:w-auto">
          <InputTextField className="w-full md:w-auto">
            <Input
              type="text"
              id="search"
              data-cy="patient-search"
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="dark:text-customNeutral-100" />
          </InputTextField>

          <Select onValueChange={setSortOption} className="w-full md:w-auto">
            <SelectTrigger
              placeholder="SORT BY"
              icon={<SortIcon />}
              data-cy="sort-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">ALPHABETICAL</SelectItem>
              <SelectItem value="date">DATE</SelectItem>
            </SelectContent>
          </Select>

          <MultiSelectFilter
            options={columns}
            selectedValues={selectedColumns}
            setSelectedValues={setSelectedColumns}
            placeholder="FILTER COLUMNS"
            mandatoryValues={["client", "dateofsession"]}
            showApplyButton={true}
            onApply={applyColumnFilters}
            data-cy="column-filter"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto" data-cy="patient-records-table">
        <Table
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        >
          <TableHeader>
            <TableRow>
              {/* Always show CLIENT column */}
              <TableHead className="py-4 whitespace-nowrap">CLIENT</TableHead>

              {/* Always show DATE OF SESSION column */}
              <TableHead className="py-4 text-center whitespace-nowrap">
                DATE OF SESSION
              </TableHead>

              {/* Conditionally show other columns based on selectedColumns */}
              {isColumnVisible.timeofsession && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  TIME OF SESSION
                </TableHead>
              )}

              {isColumnVisible.contactnumber && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  CONTACT NUMBER
                </TableHead>
              )}
              {isColumnVisible.age && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  AGE
                </TableHead>
              )}
              {isColumnVisible.email && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  EMAIL
                </TableHead>
              )}

              {isColumnVisible.personincharge && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  PERSON IN CHARGE
                </TableHead>
              )}

              {isColumnVisible.package && (
                <TableHead className="py-4 whitespace-nowrap">
                  PACKAGE
                </TableHead>
              )}

              {isColumnVisible.treatment && (
                <TableHead className="py-4 whitespace-nowrap">
                  TREATMENT
                </TableHead>
              )}

              {isColumnVisible.consentformsigned && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  CONSENT FORM SIGNED
                </TableHead>
              )}

              {isColumnVisible.paymentmethod && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  PAYMENT METHOD
                </TableHead>
              )}

              {isColumnVisible.totalamount && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  TOTAL AMOUNT
                </TableHead>
              )}

              {isColumnVisible.amountpaid && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  AMOUNT PAID
                </TableHead>
              )}

              {isColumnVisible.remainingbalance && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  REMAINING BALANCE
                </TableHead>
              )}

              {isColumnVisible.referenceno && (
                <TableHead className="py-4 text-center whitespace-nowrap">
                  REFERENCE NO.
                </TableHead>
              )}

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <TableRow key={index} data-cy={`record-row-${index}`}>
                  {/* Always show CLIENT column */}
                  <TableCell
                    className="whitespace-nowrap"
                    data-cy={`record-client-${index}`}
                  >
                    {record.client ||
                      record.patient_name?.toUpperCase() ||
                      "N/A"}
                  </TableCell>

                  {/* Always show DATE OF SESSION column */}
                  <TableCell
                    className="text-center whitespace-nowrap"
                    data-cy={`record-date-${index}`}
                  >
                    {record.dateTransacted || record.date_of_session
                      ? format(
                          new Date(
                            record.dateTransacted || record.date_of_session
                          ),
                          "MMMM dd, yyyy"
                        ).toUpperCase()
                      : "N/A"}
                  </TableCell>

                  {/* Conditionally show other cells based on selectedColumns */}
                  {isColumnVisible.timeofsession && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-time-${index}`}
                    >
                      {record.nextSessionTime || record.time_of_session
                        ? (() => {
                            const timeValue =
                              record.nextSessionTime || record.time_of_session;
                            const parsedTime = new Date(
                              `1970-01-01T${timeValue}`
                            );
                            return isNaN(parsedTime.getTime())
                              ? "Invalid Time"
                              : format(parsedTime, "hh:mm a");
                          })()
                        : "N/A"}
                    </TableCell>
                  )}

                  {isColumnVisible.contactnumber && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-contact-${index}`}
                    >
                      {record.contact_number || "N/A"}
                    </TableCell>
                  )}

                  {isColumnVisible.age && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-age-${index}`}
                    >
                      {record.age || "N/A"}
                    </TableCell>
                  )}

                  {isColumnVisible.email && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-email-${index}`}
                    >
                      {record.email || "N/A"}
                    </TableCell>
                  )}

                  {isColumnVisible.personincharge && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-personincharge-${index}`}
                    >
                      {(
                        record.personInCharge || record.person_in_charge
                      )?.toUpperCase()}
                    </TableCell>
                  )}

                  {isColumnVisible.package && (
                    <TableCell
                      className="whitespace-nowrap"
                      data-cy={`record-package-${index}`}
                    >
                      {(record.package || record.package_name)?.toUpperCase()}
                    </TableCell>
                  )}

                  {isColumnVisible.treatment && (
                    <TableCell
                      className="text-left whitespace-nowrap"
                      data-cy={`record-treatment-${index}`}
                    >
                      {Array.isArray(record.treatment_ids)
                        ? getTreatmentNames(record.treatment_ids)
                            .join(", ")
                            .toUpperCase()
                        : "N/A"}
                    </TableCell>
                  )}

                  {isColumnVisible.consentformsigned && (
                    <TableCell
                      className="text-center whitespace-nowrap"
                      data-cy={`record-consent-${index}`}
                    >
                      {record.consentStatus ||
                        (typeof record.consent_form_signed === "boolean"
                          ? record.consent_form_signed
                            ? "YES"
                            : "NO"
                          : record.consent_form_signed)}
                    </TableCell>
                  )}

                  {isColumnVisible.paymentmethod && (
                    <TableCell
                      className="whitespace-nowrap"
                      data-cy={`record-paymentmethod-${index}`}
                    >
                      {(
                        record.paymentMethod || record.payment_method
                      )?.toUpperCase()}
                    </TableCell>
                  )}

                  {isColumnVisible.totalamount && (
                    <TableCell
                      className="text-center"
                      data-cy={`record-total-${index}`}
                    >
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(parseFloat(record.total_amount || 0))}
                    </TableCell>
                  )}

                  {isColumnVisible.amountpaid && (
                    <TableCell
                      className="text-center"
                      data-cy={`record-paid-${index}`}
                    >
                      {record.amount_paid
                        ? new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP"
                          }).format(record.amount_paid)
                        : "₱0.00"}
                    </TableCell>
                  )}

                  {isColumnVisible.remainingbalance && (
                    <TableCell
                      className="text-center"
                      data-cy={`record-remaining-${index}`}
                    >
                      {(() => {
                        const total = parseFloat(record.total_amount || 0);
                        const paid = parseFloat(record.amount_paid || 0);
                        const remaining = total - paid;
                        return new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP"
                        }).format(remaining);
                      })()}
                    </TableCell>
                  )}

                  {isColumnVisible.referenceno && (
                    <TableCell
                      className="text-center"
                      data-cy={`record-refno-${index}`}
                    >
                      {record.reference_number || "N/A"}
                    </TableCell>
                  )}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        data-cy={`record-menu-trigger-${index}`}
                      >
                        <EllipsisIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleOpenUpdateEntry(record)}
                            data-cy={`record-update-button-${index}`}
                          >
                            <UpdateIcon />
                            <p className="font-semibold">Update</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenEditEntry(record)}
                            data-cy={`record-edit-button-${index}`}
                          >
                            <EditIcon />
                            <p className="font-semibold">Edit</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenArchiveEntry(record)}
                            data-cy={`record-archive-button-${index}`}
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
                  colSpan={selectedColumns.length + 2}
                  className="text-center"
                  data-cy="no-records-message"
                >
                  NO PATIENT RECORDS CURRENTLY AVAILABLE
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div
        className="flex flex-col md:flex-row gap-4 justify-end"
        data-cy="patient-records-actions"
      >
        <Button
          onClick={() => openModal("createEntry")}
          className="w-full md:w-auto"
          data-cy="add-entry-button"
        >
          <PlusIcon />
          ADD NEW ENTRY
        </Button>
        <Button
          variant="callToAction"
          onClick={() => generatePRDReport(records)}
          className="w-full md:w-auto"
          data-cy="download-records-button"
        >
          <DownloadIcon />
          <span className="hidden md:inline">DOWNLOAD PATIENT RECORDS</span>
          <span className="md:hidden">DOWNLOAD RECORDS</span>
        </Button>
      </div>

      {currentModal === "createEntry" && (
        <CreatePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          data-cy="create-patient-entry-modal"
        />
      )}
      {currentModal === "editEntry" && selectedEntry && (
        <EditPatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onSubmit={handleEditPatientEntry}
          data-cy="edit-patient-entry-modal"
        />
      )}
      {currentModal === "updateEntry" && selectedEntry && (
        <UpdatePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onSubmit={handleUpdatePatientEntry}
          data-cy="update-patient-entry-modal"
        />
      )}
      {currentModal === "archiveEntry" && selectedEntry && (
        <ArchivePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onArchive={handleArchive}
          data-cy="archive-patient-entry-modal"
        />
      )}
    </div>
  );
}

export default PatientRecordsDatabase;
