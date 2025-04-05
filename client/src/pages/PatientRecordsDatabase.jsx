import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";

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

import CreatePatientEntry from "@/components/modals/CreatePatientEntry";
import EditPatientEntry from "@/components/modals/EditPatientEntry";
import ArchivePatientEntry from "@/components/modals/ArchivePatientEntry";

// Import date-fns for date formatting
import { format } from "date-fns";

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

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
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Wrap onClose to refresh the table data when a modal is closed
  const handleModalClose = () => {
    closeModal();
    fetchRecords();
  };

  // Open update entry modal
  const handleOpenEditEntry = (record) => {
    setSelectedEntry(record);
    openModal("editEntry");
  };

  // Open delete entry modal
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

    closeModal(); // instead of onClose()
    fetchRecords(); // instead of refreshData()
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

    // Get formatted current date
    const currentDate = new Date();
    const formattedCurrentDate = format(
      currentDate,
      "MMMM dd, yyyy"
    ).toUpperCase(); // REPORT: ALL CAPS
    const formattedDateForFilename = format(currentDate, "MMMM dd, yyyy"); // Filename: Only first letter capitalized

    // Add Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `BEAUTOX PATIENT RECORDS REPORT AS OF ${formattedCurrentDate}`,
      pageWidth / 2,
      margin,
      { align: "center" }
    );

    // Column headers
    const headers = [
      "CLIENT",
      "DATE OF SESSION",
      "TIME OF SESSION",
      "PERSON IN CHARGE",
      "PACKAGE",
      "TREATMENT",
      "CONSENT STATUS",
      "PAYMENT METHOD",
      "TOTAL AMOUNT"
    ];

    // Format Date & Time properly
    const formatDate = (date) =>
      date ? format(new Date(date), "MMMM dd, yyyy").toUpperCase() : "N/A";
    const formatTime = (time) => {
      if (!time) return "N/A";
      const dateObj = new Date(`1970-01-01T${time}`);
      return format(dateObj, "hh:mm a").toUpperCase(); // Convert to 12-hour format with AM/PM
    };

    // Extract and standardize data for table
    const tableData = patientRecords.map((record) => [
      record.client || record.patient_name?.toUpperCase() || "N/A",
      formatDate(record.dateTransacted || record.date_of_session),
      formatTime(record.nextSessionTime || record.time_of_session),
      (record.personInCharge || record.person_in_charge)?.toUpperCase() ||
        "N/A",
      (record.package || record.package_name)?.toUpperCase() || "N/A",
      record.treatment?.toUpperCase() || "N/A",
      typeof record.consent_form_signed === "boolean"
        ? record.consent_form_signed
          ? "SIGNED"
          : "NOT SIGNED"
        : record.consentStatus || "N/A",
      (record.paymentMethod || record.payment_method)?.toUpperCase() || "N/A",
      record.totalAmount || record.total_amount
        ? `PHP ${record.totalAmount || record.total_amount}`
        : "N/A"
    ]);

    // Generate table
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

    // Save the PDF with only the first letter capitalized in the month
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
              placeholder="Search..."
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
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1200px]">
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
              <TableHead className="py-4 whitespace-nowrap">TREATMENT</TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                CONSENT FORM SIGNED
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">PAYMENT METHOD</TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">TOTAL AMOUNT</TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">AMOUNT PAID</TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                REMAINING BALANCE
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">REFERENCE NO.</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">
                  {record.client || record.patient_name?.toUpperCase() || "N/A"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {record.dateTransacted || record.date_of_session
                    ? format(
                        new Date(
                          record.dateTransacted || record.date_of_session
                        ),
                        "MMMM dd, yyyy"
                      ).toUpperCase()
                    : "N/A"}
                </TableCell>

                <TableCell className="text-center whitespace-nowrap">
                  {record.nextSessionTime || record.time_of_session
                    ? (() => {
                        const timeValue =
                          record.nextSessionTime || record.time_of_session;
                        const parsedTime = new Date(`1970-01-01T${timeValue}`);
                        return isNaN(parsedTime.getTime())
                          ? "Invalid Time"
                          : format(parsedTime, "hh:mm a");
                      })()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {(
                    record.personInCharge || record.person_in_charge
                  )?.toUpperCase()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {(record.package || record.package_name)?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {record.treatment?.toUpperCase()}
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
                  {(
                    record.paymentMethod || record.payment_method
                  )?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {record.totalAmount || record.total_amount
                    ? new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(record.totalAmount || record.total_amount)
                    : "N/A"}
                </TableCell>
                <TableCell className="whitespace-nowrap">RANDOM INT</TableCell>
                <TableCell className="whitespace-nowrap">RANDOM INT</TableCell>
                <TableCell className="whitespace-nowrap">REF 123456</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditEntry(record)}
                        >
                          <EditIcon />
                          <p className="font-semibold">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenArchiveEntry(record)}
                        >
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
        <Button onClick={() => openModal("createEntry")} className="w-full md:w-auto">
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
          onSubmit={handleEditPatientEntry} // Pass the handleEditPatientEntry function to the modal
        />
      )}
      {currentModal === "archiveEntry" && selectedEntry && (
        <ArchivePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
          onArchive={handleArchive} // Pass the handleArchive function to update the modal
        />
      )}
    </div>
  );
}

export default PatientRecordsDatabase;
