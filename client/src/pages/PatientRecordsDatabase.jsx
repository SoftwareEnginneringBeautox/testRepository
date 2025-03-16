import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
} from "@/components/ui/table";

import { InputTextField, Input } from "@/components/ui/Input";

import {
  Select,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import DisplayEntry from "@/components/modals/DisplayEntry";
import CreatePatientEntry from "@/components/modals/CreatePatientEntry";
import UpdatePatientEntry from "@/components/modals/UpdatePatientEntry";
import DeletePatientEntry from "@/components/modals/DeletePatientEntry";

// Import date-fns for date formatting
import { format } from "date-fns";

function PatientRecordsDatabase() {
  const { currentModal, openModal, closeModal } = useModal();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [records, setRecords] = useState([]);

  // Fetch patient records from the API
  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/patients", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      setRecords(data);
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

  // Open display entry modal
  const handleOpenDisplayEntry = (record) => {
    setSelectedEntry(record);
    openModal("displayEntry");
  };

  // Open update entry modal
  const handleOpenUpdateEntry = (record) => {
    setSelectedEntry(record);
    openModal("updateEntry");
  };

  // Open delete entry modal
  const handleOpenDeleteEntry = (record) => {
    setSelectedEntry(record);
    openModal("deleteEntry");
  };

  const generatePRDReport = () => {
    if (!records || records.length === 0) {
      console.error("No records available to generate PDF.");
      return;
    }

    // Create a new jsPDF instance (Landscape mode)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt", // Points (1 inch = 72 points)
      format: "a4"
    });

    const margin = 36; // 0.5 inch margin (36 pts)
    const pageWidth = doc.internal.pageSize.width;
    const startY = margin + 10; // Title spacing

    // Add Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `BEAUTOX PATIENT RECORDS REPORTS AS OF ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      margin,
      { align: "center" }
    );

    // Define table headers
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

    // Format records for the table
    const tableData = records.map((record) => [
      record.clientName || "N/A",
      record.sessionDate || "N/A",
      record.sessionTime || "N/A",
      record.personInCharge || "N/A",
      record.package || "N/A",
      record.treatment || "N/A",
      record.consentStatus || "N/A",
      record.paymentMethod || "N/A",
      record.totalAmount ? `$${record.totalAmount}` : "N/A"
    ]);

    // Generate Table with margins
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: startY + 20, // Position table below title
      margin: { top: margin, left: margin, right: margin, bottom: margin },
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: { top: 2, right: 5, bottom: 2, left: 5 }
      },
      headStyles: {
        fillColor: "#381B4C", // Header background color
        textColor: "#FFFFFF", // White text
        fontSize: 12,
        halign: "center",
        lineWidth: 0.5,
        lineColor: "#000000"
      },
      bodyStyles: {
        lineWidth: 0.2, // 2pt borders
        lineColor: "#000000"
      }
    });

    // Save and Download PDF
    doc.save(
      "BeautoxPatientRecordsReport_" + Date().toLocaleDateString() + "_.pdf"
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
                <TableCell
                  onClick={() => handleOpenDisplayEntry(record)}
                  className="cursor-pointer"
                >
                  {record.client || record.patient_name?.toUpperCase() || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {record.dateTransacted || record.date_of_session
                    ? format(
                        new Date(
                          record.dateTransacted || record.date_of_session
                        ),
                        "yyyy-MM-dd"
                      )
                    : "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {record.nextSessionTime || record.time_of_session}
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
                  PHP {record.totalAmount || record.total_amount}
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
                      onClick={() => handleOpenDeleteEntry(record)}
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
        <Button variant="callToAction" onClick={() => generatePRDReport()}>
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
        />
      )}
      {currentModal === "deleteEntry" && selectedEntry && (
        <DeletePatientEntry
          isOpen={true}
          onClose={handleModalClose}
          entryData={selectedEntry}
        />
      )}
      {currentModal === "displayEntry" && selectedEntry && (
        <DisplayEntry
          isOpen={true}
          onClose={closeModal}
          entryData={selectedEntry}
        />
      )}
    </div>
  );
}

export default PatientRecordsDatabase;
