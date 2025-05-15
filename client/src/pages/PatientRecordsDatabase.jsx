import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
import DateRangePatientRecordDatabase from "@/components/modals/DateRangePatientRecordDatabase";

// Import date-fns for date formatting
import { format } from "date-fns";
import FilterIcon from "@/assets/icons/FilterIcon";
import UpdateIcon from "@/assets/icons/UpdateIcon";

// Add Checkbox import at the top of the file
import { Checkbox } from "@/components/ui/Checkbox";
import { Loader } from "@/components/ui/Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  // Define the column configuration
  const columnConfig = [
    { label: "CLIENT", value: "client", mandatory: true },
    { label: "DATE OF SESSION", value: "dateofsession", mandatory: true },
    { label: "TIME OF SESSION", value: "timeofsession", mandatory: false },
    { label: "CONTACT NUMBER", value: "contactnumber", mandatory: false },
    { label: "AGE", value: "age", mandatory: false },
    { label: "EMAIL", value: "email", mandatory: false },
    { label: "PERSON IN CHARGE", value: "personincharge", mandatory: false },
    { label: "PACKAGE", value: "package", mandatory: false },
    { label: "TREATMENT", value: "treatment", mandatory: false },
    { label: "SESSIONS LEFT", value: "sessionsleft", mandatory: false },
    {
      label: "CONSENT FORM SIGNED",
      value: "consentformsigned",
      mandatory: false
    },
    { label: "PAYMENT METHOD", value: "paymentmethod", mandatory: false },
    { label: "TOTAL AMOUNT", value: "totalamount", mandatory: false },
    { label: "AMOUNT PAID", value: "amountpaid", mandatory: false },
    { label: "REMAINING BALANCE", value: "remainingbalance", mandatory: false },
    { label: "REFERENCE NO.", value: "referenceno", mandatory: false }
  ];

  // Get all column values
  const allColumns = columnConfig.map((col) => col.value);

  // Get only mandatory column values
  const mandatoryColumns = columnConfig
    .filter((col) => col.mandatory)
    .map((col) => col.value);

  // State to manage column visibility - initialize with all columns visible
  //

  const [selectedColumns, setSelectedColumns] = useState([]);
  // Define isColumnVisible here, before it's used
  const isColumnVisible = (columnValue) => {
    return selectedColumns.includes(columnValue);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Initialize selectedColumns with ALL columns (not just mandatory)
  useEffect(() => {
    // Select all columns by default
    setSelectedColumns([...allColumns]);
  }, []);

  // Log when selectedColumns changes
  useEffect(() => {
    console.log("Selected columns updated:", selectedColumns);
  }, [selectedColumns]);

  // Log when selectedColumns changes
  useEffect(() => {
    console.log("Selected columns updated:", selectedColumns);
  }, [selectedColumns]);

  // Fetch patient records from the API
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      console.log("API Response Data:", data);
      setRecords(data.filter((record) => !record.archived));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
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
        // Make sure we set an array even if the API returns something else
        setTreatmentsList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching treatments:", err);
        setTreatmentsList([]); // Set empty array on error
      }
    };

    fetchTreatments();
  }, []);

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
        method: "POST",
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
          id: selectedEntry.id,
          action: "edit",
          data: safeData
        })
      });

      if (safeData.sessions_left !== undefined) {
        // Implementation would go here if needed
      }

      closeModal();
      fetchRecords();
    } catch (error) {
      console.error("❌ Failed to update patient entry:", error);
    }
  };

  const handleOpenDateRangeModal = () => {
    openModal("dateRangeModal");
  };

  const handleDateRangeSubmit = (startDate, endDate) => {
    // Convert dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day

    // Filter records within the specified date range
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(
        record.dateTransacted || record.date_of_session
      );
      return recordDate >= start && recordDate <= end;
    });

    // Generate the report with the filtered records
    if (filteredRecords.length > 0) {
      generatePRDReport(filteredRecords, null); // Pass null for monthLimit to skip that filter
    } else {
      console.error("No records available within the selected date range.");
      // You may want to show an alert here
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
      if (sortOption === "payment") {
        // Get payment methods with fallbacks
        const paymentA = a.paymentMethod || a.payment_method || "";
        const paymentB = b.paymentMethod || b.payment_method || "";

        // Check if either payment is "Full Payment" or contains "full"
        const isFullPaymentA = paymentA.toLowerCase().includes("full");
        const isFullPaymentB = paymentB.toLowerCase().includes("full");

        // Sort full payments first, then installments
        if (isFullPaymentA && !isFullPaymentB) return -1;
        if (!isFullPaymentA && isFullPaymentB) return 1;

        // If both are the same payment type, sort alphabetically by name as secondary sort
        const nameA = (a.client || a.patient_name || "").toLowerCase();
        const nameB = (b.client || b.patient_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
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

  // for limiting the amount of months to print
  const isWithinMonthRange = (date, monthLimit) => {
    const limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - monthLimit);
    return new Date(date) >= limitDate;
  };

  // Generate PDF report function
  // Generate PDF report function
  const generatePRDReport = (patientRecords, monthLimit = 6) => {
    if (!patientRecords || patientRecords.length === 0) {
      console.error("No records available to generate PDF.");
      return;
    }

    // Only apply the month filter if monthLimit is provided
    let filteredRecords = patientRecords;
    if (monthLimit !== null) {
      filteredRecords = patientRecords.filter((record) => {
        const recordDate = new Date(
          record.dateTransacted || record.date_of_session
        );
        return isWithinMonthRange(recordDate, monthLimit);
      });
    }

    if (filteredRecords.length === 0) {
      console.error(
        monthLimit
          ? `No records available within the last ${monthLimit} months.`
          : "No records available within the selected date range."
      );
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    const availableWidth = pageWidth - margin * 2;

    // Define base column configuration
    const baseColumns = [
      { header: "CLIENT", width: 100 },
      { header: "DATE", width: 70 },
      { header: "TIME", width: 60 },
      { header: "CONTACT", width: 80 },
      { header: "AGE", width: 35 },
      { header: "EMAIL", width: 120 },
      { header: "PIC", width: 70 },
      { header: "PACKAGE", width: 100 },
      { header: "TREATMENT", width: 100 },
      { header: "SESS LEFT", width: 40 },
      { header: "CS", width: 30 },
      { header: "MODE", width: 50 },
      { header: "TOTAL", width: 70 },
      { header: "PAID", width: 70 },
      { header: "BALANCE", width: 70 },
      { header: "REF#", width: 70 }
    ];

    // Calculate scaling factor
    const naturalWidth = baseColumns.reduce((sum, col) => sum + col.width, 0);
    const scaleFactor = availableWidth / naturalWidth;

    // Scale column widths
    const headers = baseColumns.map((col) => ({
      header: col.header,
      width: col.width * scaleFactor
    }));

    // Helper functions
    const formatDate = (date) =>
      date ? format(new Date(date), "MM/dd/yy").toUpperCase() : "N/A";

    const formatTime = (time) => {
      if (!time) return "N/A";
      const dateObj = new Date(`1970-01-01T${time}`);
      return format(dateObj, "hh:mm a").toUpperCase();
    };

    const formatCurrency = (amount) => {
      if (!amount || isNaN(amount) || parseFloat(amount) === 0) return "P0";
      const num = Math.abs(Math.round(parseFloat(amount)));
      return `P${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    const formatPaymentMethod = (method) => {
      if (!method) return "N/A";
      return method.toLowerCase().includes("full") ? "FULL" : "INSTALL";
    };

    // Add title and date range
    const currentDate = new Date();

    // Determine date range for report title
    let startDate, endDate;
    if (monthLimit !== null) {
      // If using month limit, calculate from current date
      startDate = new Date();
      startDate.setMonth(currentDate.getMonth() - monthLimit);
      endDate = currentDate;
    } else {
      // If we're using custom dates, find min and max dates in filtered records
      startDate = new Date(
        Math.min(
          ...filteredRecords.map(
            (record) =>
              new Date(record.dateTransacted || record.date_of_session)
          )
        )
      );
      endDate = new Date(
        Math.max(
          ...filteredRecords.map(
            (record) =>
              new Date(record.dateTransacted || record.date_of_session)
          )
        )
      );
    }

    const formattedStartDate = format(startDate, "MMMM dd, yyyy").toUpperCase();
    const formattedEndDate = format(endDate, "MMMM dd, yyyy").toUpperCase();
    const formattedDateForFilename = format(currentDate, "MMMM_dd_yyyy");

    // Set up document title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BEAUTOX PATIENT RECORDS REPORT", pageWidth / 2, margin + 10, {
      align: "center"
    });

    // Add date range
    doc.setFontSize(12);
    doc.text(
      `${formattedStartDate} - ${formattedEndDate}`,
      pageWidth / 2,
      margin + 30,
      { align: "center" }
    );

    // Add timestamp
    const currentTimestamp = format(
      new Date(),
      "MMMM dd, yyyy 'at' hh:mm a"
    ).toUpperCase();
    doc.setFontSize(10);
    doc.text(`AS OF ${currentTimestamp}`, pageWidth / 2, margin + 50, {
      align: "center"
    });

    // Add patient count
    doc.setFontSize(10);
    doc.text(
      `TOTAL PATIENTS: ${filteredRecords.length}`,
      pageWidth / 2,
      margin + 65,
      { align: "center" }
    );

    // Prepare table data
    const tableData = filteredRecords.map((record) => {
      const total = parseFloat(record.total_amount ?? "0");
      const paid = parseFloat(record.amount_paid || "0");
      const remaining = total - paid;

      return [
        record.client || record.patient_name?.toUpperCase() || "N/A",
        formatDate(record.dateTransacted || record.date_of_session),
        formatTime(record.nextSessionTime || record.time_of_session),
        record.contact_number || "N/A",
        record.age?.toString() || "N/A",
        record.email || "N/A",
        (record.personInCharge || record.person_in_charge)?.toUpperCase() ||
          "N/A",
        (record.package || record.package_name)?.toUpperCase() || "N/A",
        Array.isArray(record.treatment_ids)
          ? getTreatmentNames(record.treatment_ids).join(", ").toUpperCase()
          : record.treatment?.toUpperCase() || "N/A",
        record.sessions_left || "N/A",
        record.consent_form_signed ? "Y" : "N",
        formatPaymentMethod(record.paymentMethod || record.payment_method),
        formatCurrency(total),
        formatCurrency(paid),
        formatCurrency(remaining),
        record.reference_number || "N/A"
      ];
    });

    // Generate table
    autoTable(doc, {
      head: [headers.map((h) => h.header)],
      body: tableData,
      startY: margin + 80, // Adjusted for the patient count line
      margin: { top: margin, right: margin, bottom: margin, left: margin },
      columnStyles: {
        ...headers.reduce((acc, col, index) => {
          acc[index] = {
            cellWidth: col.width,
            fontSize: 8,
            cellPadding: 3,
            overflow: "linebreak"
          };
          return acc;
        }, {}),
        4: { halign: "center" },
        9: { halign: "center" },
        10: { halign: "center" },
        12: { halign: "right", cellPadding: { right: 5 } },
        13: { halign: "right", cellPadding: { right: 5 } },
        14: { halign: "right", cellPadding: { right: 5 } }
      },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        cellWidth: "wrap",
        minCellHeight: 14,
        valign: "middle"
      },
      headStyles: {
        fillColor: "#381B4C",
        textColor: "#FFFFFF",
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
        valign: "middle"
      },
      alternateRowStyles: {
        fillColor: "#F8F8F8"
      },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
      },
      willDrawCell: function (data) {
        if (
          data.cell.text &&
          typeof data.cell.text === "string" &&
          ![4, 9, 10, 12, 13, 14].includes(data.column.index)
        ) {
          const maxWidth =
            data.cell.styles.cellWidth - data.cell.styles.cellPadding * 2;
          const textWidth =
            doc.getStringUnitWidth(data.cell.text) * data.cell.styles.fontSize;

          if (textWidth > maxWidth) {
            const charactersPerLine = Math.floor(
              (maxWidth / textWidth) * data.cell.text.length
            );
            data.cell.text =
              data.cell.text.substring(0, charactersPerLine - 3) + "...";
          }
        }
      }
    });

    // Create a more descriptive filename if using custom date range
    let filename;
    if (monthLimit === null) {
      // For custom date range
      const startFilename = format(startDate, "MMddyyyy");
      const endFilename = format(endDate, "MMddyyyy");
      filename = `Beautox_PatientRecords_${startFilename}_to_${endFilename}.pdf`;
    } else {
      // For standard month limit
      filename = `Beautox_PatientRecords_${formattedDateForFilename}.pdf`;
    }

    // Save the PDF
    doc.save(filename);
  };

  // Add this function before the return statement
  const renderCellContent = (record, columnValue, index) => {
    switch (columnValue) {
      case "client":
        return record.client || record.patient_name?.toUpperCase() || "N/A";

      case "dateofsession":
        return record.dateTransacted || record.date_of_session
          ? format(
              new Date(record.dateTransacted || record.date_of_session),
              "MMMM dd, yyyy"
            ).toUpperCase()
          : "N/A";

      case "timeofsession":
        return record.nextSessionTime || record.time_of_session
          ? (() => {
              const timeValue =
                record.nextSessionTime || record.time_of_session;
              const parsedTime = new Date(`1970-01-01T${timeValue}`);
              return isNaN(parsedTime.getTime())
                ? "Invalid Time"
                : format(parsedTime, "hh:mm a");
            })()
          : "N/A";

      case "contactnumber":
        return record.contact_number || "N/A";

      case "age":
        return record.age || "N/A";

      case "email":
        return record.email || "N/A";

      case "personincharge":
        return (
          (record.personInCharge || record.person_in_charge)?.toUpperCase() ||
          "N/A"
        );

      case "package":
        return (record.package || record.package_name)?.toUpperCase() || "N/A";

      case "treatment":
        return Array.isArray(record.treatment_ids) &&
          record.treatment_ids.length > 0 ? (
          <div className="flex flex-col gap-1">
            {record.treatment_ids.map((id) => {
              // Add safety check to ensure treatmentsList is an array
              const treatment = Array.isArray(treatmentsList)
                ? treatmentsList.find((t) => t.id === id)
                : null;

              return treatment ? (
                <Badge
                  key={treatment.id}
                  variant="outline"
                  data-cy={`record-treatment-badge-${record.id}-${treatment.id}`}
                >
                  + {treatment.treatment_name.toUpperCase()}
                </Badge>
              ) : (
                <Badge key={id} variant="outline">
                  + Unknown Treatment ({id})
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );

      case "sessionsleft":
        return record.sessions_left || 0;

      case "consentformsigned":
        return (
          record.consentStatus ||
          (typeof record.consent_form_signed === "boolean"
            ? record.consent_form_signed
              ? "YES"
              : "NO"
            : record.consent_form_signed) ||
          "N/A"
        );

      case "paymentmethod":
        return (
          (record.paymentMethod || record.payment_method)?.toUpperCase() ||
          "N/A"
        );

      case "totalamount":
        return new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP"
        }).format(parseFloat(record.total_amount || 0));

      case "amountpaid":
        return record.amount_paid
          ? new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP"
            }).format(record.amount_paid)
          : "₱0.00";

      case "remainingbalance":
        return (() => {
          const total = parseFloat(record.total_amount || 0);
          const paid = parseFloat(record.amount_paid || 0);
          const remaining = total - paid;
          return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
          }).format(remaining);
        })();

      case "referenceno":
        return record.reference_number || "N/A";

      default:
        return "N/A";
    }
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
              <SelectItem value="payment">PAYMENT METHOD</SelectItem>
            </SelectContent>
          </Select>

          <MultiSelectFilter
            options={columnConfig}
            selectedValues={selectedColumns}
            setSelectedValues={setSelectedColumns}
            placeholder="FILTER COLUMNS"
            mandatoryValues={mandatoryColumns}
            showApplyButton={true}
            data-cy="column-filter"
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="w-full overflow-x-auto" data-cy="patient-records-table">
          <Table
            showPagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          >
            <TableHeader>
              <TableRow>
                {/* Replace all the existing conditional TableHead elements */}
                {columnConfig
                  .filter((col) => selectedColumns.includes(col.value))
                  .map((column) => (
                    <TableHead
                      key={column.value}
                      className={cn(
                        "py-4 whitespace-nowrap",
                        column.value === "client" ? "text-start" : "text-center"
                      )}
                      data-cy={`table-header-${column.value}`}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                <TableHead
                  isSticky
                  className="bg-lavender-400 dark:bg-customNeutral-600"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record, index) => (
                  <TableRow key={index} data-cy={`record-row-${index}`}>
                    {/* Replace all the existing conditional TableCell elements */}
                    {columnConfig
                      .filter((col) => selectedColumns.includes(col.value))
                      .map((column) => (
                        <TableCell
                          key={column.value}
                          className={cn(
                            "whitespace-nowrap",
                            column.value === "client"
                              ? "text-start"
                              : "text-center",
                            [
                              "totalamount",
                              "amountpaid",
                              "remainingbalance"
                            ].includes(column.value)
                              ? "text-right"
                              : ""
                          )}
                          data-cy={`record-cell-${column.value}-${index}`}
                        >
                          {renderCellContent(record, column.value, index)}
                        </TableCell>
                      ))}
                    <TableCell isSticky>
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
                    colSpan={selectedColumns.length + 1}
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
      )}

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
          onClick={handleOpenDateRangeModal}
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
      {currentModal === "dateRangeModal" && (
        <DateRangePatientRecordDatabase
          isOpen={true}
          onClose={closeModal}
          onSubmit={handleDateRangeSubmit}
          data-cy="date-range-modal"
        />
      )}
    </div>
  );
}

export default PatientRecordsDatabase;
