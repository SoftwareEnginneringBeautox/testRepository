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
  Select,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select";

import CreatePatientEntry from "@/components/modals/CreatePatientEntry";
import UpdatePatientEntry from "@/components/modals/UpdatePatientEntry";
import ArchivePatientEntry from "@/components/modals/ArchivePatientEntry";

// Import date-fns for date formatting
import { format } from "date-fns";

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);

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
  const handleOpenUpdateEntry = (record) => {
    setSelectedEntry(record);
    openModal("updateEntry");
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
    <div className="flex flex-col gap-[1.5rem] text-left w-[90%] mx-auto">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-[2rem] leading-[2.8rem]">
          PATIENT RECORDS
        </h4>
        <div className="flex items-center justify-center gap-4 min-w-9">
          <InputTextField>
            <Input type="text" id="search" placeholder="Search..." />
            <MagnifyingGlassIcon />
          </InputTextField>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="SORT BY" />
              <SelectIcon>
                <SortIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">ALPHABETICAL</SelectItem>
              <SelectItem value="date">DATE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto">
        <Table className="flex-1">
          <TableHeader>
            <TableRow>
              <TableHead className="py-4">CLIENT</TableHead>
              <TableHead className="py-4 text-center">
                DATE OF SESSION
              </TableHead>
              <TableHead className="py-4 text-center">
                TIME OF SESSION
              </TableHead>
              <TableHead className="py-4 text-center">
                PERSON IN CHARGE
              </TableHead>
              <TableHead className="py-4">PACKAGE</TableHead>
              <TableHead className="py-4">TREATMENT</TableHead>
              <TableHead className="py-4 text-center">
                CONSENT FORM SIGNED
              </TableHead>
              <TableHead className="py-4 text-center">PAYMENT METHOD</TableHead>
              <TableHead className="py-4 text-center">TOTAL AMOUNT</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  {record.client || record.patient_name?.toUpperCase() || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {record.dateTransacted || record.date_of_session
                    ? format(
                        new Date(
                          record.dateTransacted || record.date_of_session
                        ),
                        "MMMM dd, yyyy"
                      ).toUpperCase()
                    : "N/A"}
                </TableCell>

                <TableCell className="text-center">
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
                <TableCell className="text-center">
                  {(
                    record.personInCharge || record.person_in_charge
                  )?.toUpperCase()}
                </TableCell>
                <TableCell>
                  {(record.package || record.package_name)?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  {record.treatment?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  {record.consentStatus ||
                    (typeof record.consent_form_signed === "boolean"
                      ? record.consent_form_signed
                        ? "YES"
                        : "NO"
                      : record.consent_form_signed)}
                </TableCell>
                <TableCell>
                  {(
                    record.paymentMethod || record.payment_method
                  )?.toUpperCase()}
                </TableCell>
                <TableCell className="text-center">
                  {record.totalAmount || record.total_amount
                    ? new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(record.totalAmount || record.total_amount)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-reflexBlue-400"
                      onClick={() => handleOpenUpdateEntry(record)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="text-reflexBlue-400"
                      onClick={() => handleOpenArchiveEntry(record)}
                    >
                      <ArchiveIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row gap-4 justify-end">
        <Button variant="outline">
          <ChevronLeftIcon />
          RETURN
        </Button>
        <Button onClick={() => openModal("createEntry")}>
          <PlusIcon />
          ADD NEW ENTRY
        </Button>
        <Button
          variant="callToAction"
          onClick={() => generatePRDReport(records)}
        >
          <DownloadIcon />
          DOWNLOAD PATIENT RECORDS
        </Button>
      </div>

      {currentModal === "createEntry" && (
        <CreatePatientEntry isOpen={true} onClose={handleModalClose} />
      )}
      {currentModal === "updateEntry" && selectedEntry && (
        <UpdatePatientEntry
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
