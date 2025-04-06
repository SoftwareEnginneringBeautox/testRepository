import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_URL;

import { Button } from "@/components/ui/Button";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import SortIcon from "@/assets/icons/SortIcon";
import MagnifyingGlassIcon from "@/assets/icons/MagnifyingGlassIcon";
import EditIcon from "@/assets/icons/EditIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";
import UpdateIcon from "@/assets/icons/UpdateIcon";

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
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select";

import { Checkbox } from "@/components/ui/Checkbox";

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

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [selectedColumns, setSelectedColumns] = useState([
    "client",           // Mandatory
    "dateofsession",    // Mandatory
    "timeofsession",
    "personincharge",
    "package",
    "treatment",
    "consentformsigned",
    "paymentmethod",
    "totalamount",
    "amountpaid",
    "remainingbalance",
    "referenceno"
  ]);

  const columns = [
    { label: "CLIENT", value: "client", mandatory: true },
    { label: "DATE OF SESSION", value: "dateofsession", mandatory: true },
    { label: "TIME OF SESSION", value: "timeofsession" },
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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

  // Refresh data when a modal closes
  const handleModalClose = () => {
    closeModal();
    fetchRecords();
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
    closeModal();
    fetchRecords();
  };

  // Handle Paid dropdown change
  const handlePaidChange = async (record, newValue) => {
    const newVal = newValue === "-" ? null : newValue;
    try {
      // Update the patient record's isPaid field
      await fetch(`${API_BASE_URL}/api/manage-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          table: "patient_records",
          id: record.id,
          action: "edit",
          data: { isPaid: newVal }
        })
      });

      // If the new value is "yes", also insert a new record into the sales tracker table.
      if (newVal === "yes") {
        // Format the sales data based on your sales tracker table's requirements.
        const salesData = {
          client: record.client || record.patient_name,
          // Use the session date (or date_transacted if available)
          date_transacted: record.dateTransacted || record.date_of_session,
          // Payment amount could be the amount paid; adjust if needed
          payment: record.amount_paid,
          reference_number: record.reference_number
          // Add any other fields as required by your sales tracker table schema
        };

        await fetch(`${API_BASE_URL}/api/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(salesData)
        });
      }

      fetchRecords();
    } catch (error) {
      console.error("Error updating isPaid or posting to sales tracker:", error);
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
    const formattedCurrentDate = format(currentDate, "MMMM dd, yyyy").toUpperCase();
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
        (record.personInCharge || record.person_in_charge)?.toUpperCase() || "N/A",
        (record.package || record.package_name)?.toUpperCase() || "N/A",
        record.treatment?.toUpperCase() || "N/A",
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

  return (
    <div className="flex flex-col gap-4 md:gap-[1.5rem] text-left w-full md:w-[90%] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h4 className="font-semibold text-xl md:text-[2rem] leading-normal md:leading-[2.8rem]">
          PATIENT RECORDS
        </h4>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 w-full md:w-auto">
          <InputTextField className="w-full md:w-auto">
            <Input
              type="text"
              id="search"
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon />
          </InputTextField>

          <Select onValueChange={setSortOption} className="w-full md:w-auto">
            <SelectTrigger placeholder="SORT BY" icon={<SortIcon />}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">ALPHABETICAL</SelectItem>
              <SelectItem value="date">DATE</SelectItem>
            </SelectContent>
          </Select>

          <Select className="w-full md:w-auto">
            <SelectTrigger placeholder="FILTER COLUMN" icon={<FilterIcon />}>
              <SelectValue>
                {selectedColumns.length > 0
                  ? `${selectedColumns.length} selected`
                  : "Select columns"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="min-w-[200px] p-2">
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {columns.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md",
                      option.mandatory 
                        ? "bg-gray-100 cursor-not-allowed opacity-60" 
                        : "hover:bg-lavender-100 cursor-pointer"
                    )}
                    onClick={() => {
                      if (option.mandatory) return; // Prevent clicking on mandatory columns
                      
                      const newSelection = selectedColumns.includes(option.value)
                        ? selectedColumns.filter(
                            (item) => item !== option.value
                          )
                        : [...selectedColumns, option.value];
                      
                      // Ensure mandatory columns are always included
                      const mandatoryColumns = columns
                        .filter(col => col.mandatory)
                        .map(col => col.value);
                      
                      setSelectedColumns([...new Set([...mandatoryColumns, ...newSelection])]);
                    }}
                  >
                    <Checkbox
                      checked={selectedColumns.includes(option.value)}
                      disabled={option.mandatory}
                      onCheckedChange={() => {
                        if (option.mandatory) return;
                        
                        const newSelection = selectedColumns.includes(option.value)
                          ? selectedColumns.filter(
                              (item) => item !== option.value
                            )
                          : [...selectedColumns, option.value];
                        
                        // Ensure mandatory columns are always included
                        const mandatoryColumns = columns
                          .filter(col => col.mandatory)
                          .map(col => col.value);
                        
                        setSelectedColumns([...new Set([...mandatoryColumns, ...newSelection])]);
                      }}
                      id={`checkbox-${option.value}`}
                      className={cn(
                        "data-[state=checked]:bg-lavender-400 data-[state=checked]:border-lavender-400",
                        option.mandatory && "opacity-60"
                      )}
                    />
                    <label
                      htmlFor={`checkbox-${option.value}`}
                      className={cn(
                        "flex-1 text-sm font-medium",
                        option.mandatory ? "cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      {option.label}
                      {option.mandatory && (
                        <span className="ml-1 text-xs text-gray-500">(Required)</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table
          className="min-w-[1200px]"
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 whitespace-nowrap">CLIENT</TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                DATE OF SESSION
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                TIME OF SESSION
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PERSON IN CHARGE
              </TableHead>
              <TableHead className="py-4 whitespace-nowrap">PACKAGE</TableHead>
              <TableHead className="py-4 whitespace-nowrap">
                TREATMENT
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                CONSENT FORM SIGNED
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PAYMENT METHOD
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                TOTAL AMOUNT
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                AMOUNT PAID
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                REMAINING BALANCE
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                REFERENCE NO.
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">PAID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">
                  {record.client || record.patient_name?.toUpperCase() || "N/A"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {record.dateTransacted || record.date_of_session
                    ? format(
                        new Date(record.dateTransacted || record.date_of_session),
                        "MMMM dd, yyyy"
                      ).toUpperCase()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {record.nextSessionTime || record.time_of_session
                    ? (() => {
                        const timeValue = record.nextSessionTime || record.time_of_session;
                        const parsedTime = new Date(`1970-01-01T${timeValue}`);
                        return isNaN(parsedTime.getTime())
                          ? "Invalid Time"
                          : format(parsedTime, "hh:mm a");
                      })()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {(record.personInCharge || record.person_in_charge)?.toUpperCase()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {(record.package || record.package_name)?.toUpperCase()}
                </TableCell>
                <TableCell className="text-left whitespace-nowrap">
                  {record.treatment
                    ? Array.isArray(record.treatment)
                      ? record.treatment.join(", ").toUpperCase()
                      : record.treatment.toUpperCase()
                    : "N/A"}
                </TableCell>

                <TableCell className="text-center whitespace-nowrap">
                  {record.consentStatus ||
                    (typeof record.consent_form_signed === "boolean"
                      ? record.consent_form_signed
                        ? "YES"
                        : "NO"
                      : record.consent_form_signed)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {(record.paymentMethod || record.payment_method)?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(parseFloat(record.total_amount || 0))}
                </TableCell>
                <TableCell className="text-center">
                  {record.amount_paid
                    ? new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(record.amount_paid)
                    : "₱0.00"}
                </TableCell>
                <TableCell className="text-center">
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
                <TableCell className="text-center">
                  {record.reference_number || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={record.isPaid ? record.isPaid.toLowerCase() : "-"}
                    onValueChange={(val) => handlePaidChange(record, val)}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue>
                        {record.isPaid ? record.isPaid.toUpperCase() : "-"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">-</SelectItem>
                      <SelectItem value="yes">YES</SelectItem>
                      <SelectItem value="no">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleOpenEditEntry(record)}>
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenArchiveEntry(record)}>
                          <ArchiveIcon />
                          <p className="font-semibold">Archive</p>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Button variant="outline" className="w-full md:w-auto">
          <ChevronLeftIcon />
          RETURN
        </Button>
        <Button
          onClick={() => openModal("createEntry")}
          className="w-full md:w-auto"
        >
          <PlusIcon />
          ADD NEW ENTRY
        </Button>
        <Button
          variant="callToAction"
          onClick={() => generatePRDReport(records)}
          className="w-full md:w-auto"
        >
          <DownloadIcon />
          <span className="hidden md:inline">DOWNLOAD PATIENT RECORDS</span>
          <span className="md:hidden">DOWNLOAD RECORDS</span>
        </Button>
      </div>

      {currentModal === "createEntry" && (
        <CreatePatientEntry isOpen={true} onClose={handleModalClose} />
      )}
      {currentModal === "editEntry" && selectedEntry && (
        <EditPatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onSubmit={handleEditPatientEntry}
        />
      )}
      {currentModal === "updateEntry" && selectedEntry && (
        <UpdatePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          // Pass the handleEditPatientEntry function to the modal
        />
      )}
      {currentModal === "archiveEntry" && selectedEntry && (
        <ArchivePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onArchive={handleArchive}
        />
      )}
    </div>
  );
}

export default PatientRecordsDatabase;
