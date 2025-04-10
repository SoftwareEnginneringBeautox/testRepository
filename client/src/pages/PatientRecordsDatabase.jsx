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
    { label: "CONSENT FORM SIGNED", value: "consentformsigned", mandatory: false },
    { label: "PAYMENT METHOD", value: "paymentmethod", mandatory: false },
    { label: "TOTAL AMOUNT", value: "totalamount", mandatory: false },
    { label: "AMOUNT PAID", value: "amountpaid", mandatory: false },
    { label: "REMAINING BALANCE", value: "remainingbalance", mandatory: false },
    { label: "REFERENCE NO.", value: "referenceno", mandatory: false }
  ];

  // Get all column values
  const allColumns = columnConfig.map(col => col.value);
  
  // Get only mandatory column values
  const mandatoryColumns = columnConfig
    .filter(col => col.mandatory)
    .map(col => col.value);

  // State to manage column visibility - initialize with all columns visible
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initialVisibility = {};
    allColumns.forEach(col => {
      initialVisibility[col] = true;
    });
    return initialVisibility;
  });

  // State for temporary column selections (before applying)
  const [tempColumnVisibility, setTempColumnVisibility] = useState({...columnVisibility});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Function to handle individual column selection change
  const handleColumnToggle = (column) => {
    // Don't allow toggling mandatory columns
    if (mandatoryColumns.includes(column)) return;
    
    setTempColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Function to handle "Select All" action
  const handleSelectAll = (isSelected) => {
    const newState = {...tempColumnVisibility};
    
    // Set all non-mandatory columns to the selected state
    allColumns.forEach(col => {
      if (!mandatoryColumns.includes(col)) {
        newState[col] = isSelected;
      }
    });
    
    setTempColumnVisibility(newState);
  };

  // Function to apply column filter changes
  const applyColumnFilters = useCallback(() => {
    // Ensure mandatory columns are visible
    const newVisibility = {...tempColumnVisibility};
    
    mandatoryColumns.forEach(col => {
      newVisibility[col] = true;
    });
    
    // Set the new column visibility
    setColumnVisibility(newVisibility);
    
    // Debug output
    console.log("Applied column filters:", newVisibility);
  }, [tempColumnVisibility, mandatoryColumns]);

  // Reset tempColumnVisibility whenever columnVisibility changes
  useEffect(() => {
    setTempColumnVisibility({...columnVisibility});
  }, [columnVisibility]);

  // Log visibility state changes for debugging
  useEffect(() => {
    console.log("Column visibility state:", columnVisibility);
  }, [columnVisibility]);

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
        setTreatmentsList(data);
      } catch (err) {
        console.error("Error fetching treatments:", err);
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

  // Generate PDF report function
  const generatePRDReport = (patientRecords) => {
    if (!patientRecords || patientRecords.length === 0) {
      console.error("No records available to generate PDF.");
      return;
    }

    // Implementation for PDF generation (unchanged)
    const tempDoc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = tempDoc.internal.pageSize.width;
    const pageHeight = tempDoc.internal.pageSize.height;
    const margin = 40;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

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

    // Calculate total natural width
    const naturalWidth = baseColumns.reduce((sum, col) => sum + col.width, 0);

    // Calculate scaling factor to fit available width
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

    // Manual currency formatting function
    const formatCurrency = (amount) => {
      // Handle zero, null, undefined, or NaN explicitly
      if (!amount || isNaN(amount) || parseFloat(amount) === 0) return "P0";

      // Convert to absolute number and round to remove decimals
      const num = Math.abs(Math.round(parseFloat(amount)));

      // Convert to string and add thousand separators
      const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return `P${formatted}`;
    };

    const formatPaymentMethod = (method) => {
      if (!method) return "N/A";
      return method.toLowerCase().includes("full") ? "FULL" : "INSTALL";
    };

    // Create the actual document
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    // Format current date
    const currentDate = new Date();
    const formattedCurrentDate = format(
      currentDate,
      "MMMM dd, yyyy"
    ).toUpperCase();
    const formattedDateForFilename = format(currentDate, "MMMM_dd_yyyy");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `BEAUTOX PATIENT RECORDS REPORT AS OF ${formattedCurrentDate}`,
      pageWidth / 2,
      margin + 10,
      { align: "center" }
    );

    // Prepare table data
    const tableData = patientRecords.map((record) => {
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
        record.sessions_left || "N/A", // Display sessions left
        record.consent_form_signed ? "Y" : "N",
        formatPaymentMethod(record.paymentMethod || record.payment_method),
        formatCurrency(total),
        formatCurrency(paid),
        formatCurrency(remaining),
        record.reference_number || "N/A"
      ];
    });

    // Configure and draw the table
    autoTable(doc, {
      head: [headers.map((h) => h.header)],
      body: tableData,
      startY: margin + 30,
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
        // Special handling for specific columns
        4: { halign: "center" }, // Age column centered
        9: { halign: "center" }, // Sessions left centered
        10: { halign: "center" }, // CS (Consent) column centered
        12: { halign: "right", cellPadding: { right: 5 } }, // Total
        13: { halign: "right", cellPadding: { right: 5 } }, // Paid
        14: { halign: "right", cellPadding: { right: 5 } } // Balance
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
        // Handle text overflow except for age and currency columns
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

    // Save the PDF
    doc.save(`Beautox_PatientRecords_${formattedDateForFilename}.pdf`);
  };

  // Custom filter component for column selection
  const ColumnFilterMenu = () => {
    const allSelected = allColumns.every(col => 
      mandatoryColumns.includes(col) || tempColumnVisibility[col]
    );
    
    return (
      <div className="bg-white dark:bg-slate-950 py-2 rounded-md shadow-md border border-slate-200 dark:border-slate-800 w-72">
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all" 
              checked={allSelected}
              onCheckedChange={(checked) => handleSelectAll(checked)}
            />
            <label htmlFor="select-all" className="font-medium">Select All</label>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto py-1">
          {columnConfig.map(column => (
            <div key={column.value} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`column-${column.value}`}
                  checked={tempColumnVisibility[column.value]}
                  onCheckedChange={() => handleColumnToggle(column.value)}
                  disabled={column.mandatory}
                />
                <label 
                  htmlFor={`column-${column.value}`}
                  className={`text-sm ${column.mandatory ? 'font-medium' : ''}`}
                >
                  {column.label}
                  {column.mandatory && <span className="ml-1 text-xs text-slate-500">(required)</span>}
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button 
            size="sm"
            onClick={applyColumnFilters}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  };

  // Convert columnConfig to format expected by MultiSelectFilter component
  const multiSelectOptions = columnConfig.map(col => ({
    label: col.label,
    value: col.value,
    mandatory: col.mandatory
  }));

  // Convert columnVisibility object to array of selected values for MultiSelectFilter
  const getSelectedValuesArray = () => {
    return Object.entries(tempColumnVisibility)
      .filter(([key, value]) => value)
      .map(([key]) => key);
  };

  // Handle MultiSelectFilter selection changes
  const handleMultiSelectChange = (selectedValues) => {
    const newVisibility = {...tempColumnVisibility};
    
    // First, set all non-mandatory columns to false
    allColumns.forEach(col => {
      if (!mandatoryColumns.includes(col)) {
        newVisibility[col] = false;
      }
    });
    
    // Then set selected columns to true
    selectedValues.forEach(val => {
      newVisibility[val] = true;
    });
    
    setTempColumnVisibility(newVisibility);
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
            options={multiSelectOptions}
            selectedValues={getSelectedValuesArray()}
            setSelectedValues={handleMultiSelectChange}
            placeholder="FILTER COLUMNS"
            mandatoryValues={mandatoryColumns}
            showApplyButton={true}
            onApply={applyColumnFilters}
            data-cy="column-filter"
          />
        </div>
      </div>

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center p-12 space-y-4" data-cy="loading-spinner">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-center text-primary font-medium">Loading patient records...</p>
        </div>
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
                {/* Conditionally render all columns based on visibility */}
                {columnVisibility.client && (
                  <TableHead className="whitespace-nowrap">CLIENT</TableHead>
                )}
                {columnVisibility.dateofsession && (
                  <TableHead className="text-center whitespace-nowrap">
                    DATE OF SESSION
                  </TableHead>
                )}
                {columnVisibility.timeofsession && (
                  <TableHead className="text-center whitespace-nowrap">
                    TIME OF SESSION
                  </TableHead>
                )}
                {columnVisibility.contactnumber && (
                  <TableHead className="text-center whitespace-nowrap">
                    CONTACT NUMBER
                  </TableHead>
                )}
                {columnVisibility.age && (
                  <TableHead className="text-center whitespace-nowrap">
                    AGE
                  </TableHead>
                )}
                {columnVisibility.email && (
                  <TableHead className="text-center whitespace-nowrap">
                    EMAIL
                  </TableHead>
                )}
                {columnVisibility.personincharge && (
                  <TableHead className="text-center whitespace-nowrap">
                    PERSON IN CHARGE
                  </TableHead>
                )}
                {columnVisibility.package && (
                  <TableHead className="whitespace-nowrap">PACKAGE</TableHead>
                )}
                {columnVisibility.treatment && (
                  <TableHead className="whitespace-nowrap">TREATMENT</TableHead>
                )}
                {columnVisibility.sessionsleft && (
                  <TableHead className="text-center whitespace-nowrap">
                    SESSIONS LEFT
                  </TableHead>
                )}
                {columnVisibility.consentformsigned && (
                  <TableHead className="text-center whitespace-nowrap">
                    CONSENT FORM SIGNED
                  </TableHead>
                )}
                {columnVisibility.paymentmethod && (
                  <TableHead className="text-center whitespace-nowrap">
                    PAYMENT METHOD
                  </TableHead>
                )}
                {columnVisibility.totalamount && (
                  <TableHead className="text-center whitespace-nowrap">
                    TOTAL AMOUNT
                  </TableHead>
                )}
                {columnVisibility.amountpaid && (
                  <TableHead className="text-center whitespace-nowrap">
                    AMOUNT PAID
                  </TableHead>
                )}
                {columnVisibility.remainingbalance && (
                  <TableHead className="text-center whitespace-nowrap">
                    REMAINING BALANCE
                  </TableHead>
                )}
                {columnVisibility.referenceno && (
                  <TableHead className="text-center whitespace-nowrap">
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
                    {/* Conditionally render all cells based on visibility */}
                    {columnVisibility.client && (
                      <TableCell
                        className="whitespace-nowrap"
                        data-cy={`record-client-${index}`}
                      >
                        {record.client ||
                          record.patient_name?.toUpperCase() ||
                          "N/A"}
                      </TableCell>
                    )}

                    {columnVisibility.dateofsession && (
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
                    )}

                    {columnVisibility.timeofsession && (
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

                   {columnVisibility.contactnumber && (
                     <TableCell
                       className="text-center whitespace-nowrap"
                       data-cy={`record-contact-${index}`}
                     >
                       {record.contact_number || "N/A"}
                     </TableCell>
                   )}

                   {columnVisibility.age && (
                     <TableCell
                       className="text-center whitespace-nowrap"
                       data-cy={`record-age-${index}`}
                     >
                       {record.age || "N/A"}
                     </TableCell>
                   )}

                   {columnVisibility.email && (
                     <TableCell
                       className="text-center whitespace-nowrap"
                       data-cy={`record-email-${index}`}
                     >
                       {record.email || "N/A"}
                     </TableCell>
                   )}

                   {columnVisibility.personincharge && (
                     <TableCell
                       className="text-center whitespace-nowrap"
                       data-cy={`record-personincharge-${index}`}
                     >
                       {(
                         record.personInCharge || record.person_in_charge
                       )?.toUpperCase()}
                     </TableCell>
                   )}

                   {columnVisibility.package && (
                     <TableCell
                       className="whitespace-nowrap"
                       data-cy={`record-package-${index}`}
                     >
                       {(record.package || record.package_name)?.toUpperCase()}
                     </TableCell>
                   )}

                   {columnVisibility.treatment && (
                     <TableCell
                       className="text-left whitespace-nowrap"
                       data-cy={`record-treatment-${index}`}
                     >
                       {Array.isArray(record.treatment_ids) &&
                       record.treatment_ids.length > 0 ? (
                         <div className="flex flex-col gap-1">
                           {record.treatment_ids.map((id) => {
                             const treatment = treatmentsList.find(
                               (t) => t.id === id
                             );
                             return treatment ? (
                               <Badge
                                 key={treatment.id}
                                 variant="outline"
                                 data-cy={`record-treatment-badge-${record.id}-${treatment.id}`}
                               >
                                 + {treatment.treatment_name.toUpperCase()}
                               </Badge>
                             ) : null;
                           })}
                         </div>
                       ) : (
                         <span className="text-muted-foreground italic">
                           N/A
                         </span>
                       )}
                     </TableCell>
                   )}
                   
                   {columnVisibility.sessionsleft && (
                     <TableCell
                       className="text-center whitespace-nowrap"
                       data-cy={`record-sessionsleft-${index}`}
                     >
                       {record.sessions_left || 0}
                     </TableCell>
                   )}

                   {columnVisibility.consentformsigned && (
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

                   {columnVisibility.paymentmethod && (
                     <TableCell
                       className="whitespace-nowrap"
                       data-cy={`record-paymentmethod-${index}`}
                     >
                       {(
                         record.paymentMethod || record.payment_method
                       )?.toUpperCase()}
                     </TableCell>
                   )}

                   {columnVisibility.totalamount && (
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

                   {columnVisibility.amountpaid && (
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

                   {columnVisibility.remainingbalance && (
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

                   {columnVisibility.referenceno && (
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
                   colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}
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