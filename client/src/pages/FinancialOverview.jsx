import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import TrendDownIcon from "@/assets/icons/TrendDownIcon";
import TrendUpIcon from "@/assets/icons/TrendDownIcon";

import CreateMonthlyExpense from "@/components/modals/CreateMonthlyExpense";
import EditMonthlyExpense from "@/components/modals/EditMonthlyExpense";
import ArchiveMonthlyExpense from "@/components/modals/ArchiveMonthlyExpense";
import CreateCategory from "@/components/modals/CreateCategory";
import EditCategory from "@/components/modals/EditCategory";
import ArchiveCategory from "@/components/modals/ArchiveCategory";
import { Button } from "@/components/ui/Button";
import DownloadIcon from "../assets/icons/DownloadIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import EditIcon from "@/assets/icons/EditIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";
import SalesChart from "../components/SalesChart";
import BeautoxPieChart from "../components/BeautoxPieChart";
import SortIcon from "@/assets/icons/SortIcon";
import MultiSelectFilter from "@/components/ui/MultiSelectFilter";
import { format } from "date-fns";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from "@/components/ui/Select";

import {
  AlertContainer,
  AlertText,
  AlertTitle,
  AlertDescription,
  CloseAlert
} from "@/components/ui/Alert";

// Define the base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

function FinancialOverview() {
  // Dynamic data states
  const [financialData, setFinancialData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netIncome: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [categories, setCategories] = useState([]);

  // Pagination states
  const [salesPage, setSalesPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value as needed

  const { currentModal, openModal, closeModal } = useModal();

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns] = useState([
    { value: "client", label: "CLIENT", mandatory: true },
    { value: "person_in_charge", label: "PERSON IN CHARGE", mandatory: false },
    { value: "date_transacted", label: "DATE TRANSACTED", mandatory: true },
    { value: "payment_method", label: "PAYMENT METHOD", mandatory: false },
    { value: "packages", label: "PACKAGES", mandatory: false },
    { value: "treatment", label: "TREATMENT", mandatory: false },
    { value: "payment", label: "PAYMENT", mandatory: true },
    { value: "reference_no", label: "REFERENCE NO.", mandatory: false }
  ]);

  // Alert state
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    variant: "default"
  });

  // Function to show alert
  const showAlert = (message, variant = "default") => {
    setAlert({ visible: true, message, variant });
    setTimeout(
      () => setAlert({ visible: false, message: "", variant: "default" }),
      3000
    );
  };

  // Static chart data and config
  const chartData = [
    { day: "Mon", currentWeek: 1300, previousWeek: 1100 },
    { day: "Tue", currentWeek: 1400, previousWeek: 1150 },
    { day: "Wed", currentWeek: 1500, previousWeek: 1200 },
    { day: "Thu", currentWeek: 1600, previousWeek: 1250 },
    { day: "Fri", currentWeek: 1700, previousWeek: 1300 },
    { day: "Sat", currentWeek: 1800, previousWeek: 1350 },
    { day: "Sun", currentWeek: 1900, previousWeek: 1400 }
  ];

  const chartConfig = {
    currentWeek: {
      label: "Sales",
      color: "#381B4C" // Lavender-400
    },
    previousWeek: {
      label: "Expenses",
      color: "#002B7F" // ReflexBlue-400
    }
  };

  const [filterType, setFilterType] = useState("all");
  const [filteredSalesData, setFilteredSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sales`);
        const data = await response.json();
        setSalesData(data); // Set the fetched sales data
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    if (filterType === "all" || !salesData) {
      setFilteredSalesData(salesData);
      return;
    }

    let filtered;
    switch (filterType) {
      case "client":
        // Group by client name and sort alphabetically
        filtered = [...salesData].sort((a, b) => {
          const clientA = a.client ? a.client.toUpperCase() : "";
          const clientB = b.client ? b.client.toUpperCase() : "";
          return clientA.localeCompare(clientB);
        });
        break;
      case "person_in_charge":
        // Group by person in charge and sort alphabetically
        filtered = [...salesData].sort((a, b) => {
          const picA = a.person_in_charge
            ? a.person_in_charge.toUpperCase()
            : "";
          const picB = b.person_in_charge
            ? b.person_in_charge.toUpperCase()
            : "";
          return picA.localeCompare(picB);
        });
        break;
      case "date_transacted":
        // Sort by date (most recent first)
        filtered = [...salesData].sort(
          (a, b) => new Date(b.date_transacted) - new Date(a.date_transacted)
        );
        break;
      default:
        filtered = salesData;
    }

    setFilteredSalesData(filtered);
    setSalesPage(1); // Reset to first page when filter changes
  }, [filterType, salesData]);

  // Update the initial setting of filteredSalesData when salesData changes
  useEffect(() => {
    setFilteredSalesData(salesData.filter((sale) => !sale.archived));
  }, [salesData]);

  // Fetch data from endpoints
  useEffect(() => {
    // 1. Financial Overview
    fetch(`${API_BASE_URL}/financial-overview`)
      .then((response) => response.json())
      .then((data) => setFinancialData(data))
      .catch((error) => {
        console.error("Error fetching financial overview:", error);
        showAlert("Error fetching financial overview", "destructive");
      });

    // 2. Sales data for table - add archived=false query parameter
    fetch(`${API_BASE_URL}/sales?archived=false`)
      .then((response) => response.json())
      .then((data) => setSalesData(data))
      .catch((error) => {
        console.error("Error fetching sales data:", error);
        showAlert("Error fetching sales data", "destructive");
      });

    // 3. Expenses data
    fetch(`${API_BASE_URL}/expenses`)
      .then((response) => response.json())
      .then((data) => setExpensesData(data))
      .catch((error) => {
        console.error("Error fetching expenses data:", error);
        showAlert("Error fetching expenses data", "destructive");
      });

    // 4. Categories
    fetch(`${API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Categories fetched:", data);
        setCategories(data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set to empty array on error
        showAlert("Error fetching categories", "destructive");
      });
  }, []);

  useEffect(() => {
    // Initialize with mandatory columns
    const mandatoryColumns = columns
      .filter((col) => col.mandatory)
      .map((col) => col.value);
    setSelectedColumns([...mandatoryColumns]);
  }, []);

  const refreshExpensesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      const data = await response.json();
      setExpensesData(data);
    } catch (error) {
      console.error("Error refreshing expenses data:", error);
      showAlert("Error refreshing expenses data", "destructive");
    }
  };

  // Add this after setting salesData
  useEffect(() => {
    // Filter out any archived records that might have slipped through
    if (salesData && salesData.length > 0) {
      const nonArchived = salesData.filter((sale) => !sale.archived);
      setFilteredSalesData(nonArchived);
    } else {
      setFilteredSalesData([]);
    }
  }, [salesData]);

  // Helper functions for pagination
  const getPaginatedData = (data, page, itemsPerPage) => {
    if (!data || data.length === 0) return [];
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (dataLength, itemsPerPage) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  // Get paginated data for tables
  const paginatedSalesData = getPaginatedData(
    filteredSalesData,
    salesPage,
    itemsPerPage
  );
  const paginatedExpensesData = getPaginatedData(
    expensesData,
    expensesPage,
    itemsPerPage
  );

  // Calculate total pages
  const totalSalesPages = getTotalPages(
    filteredSalesData?.length || 0,
    itemsPerPage
  );
  const totalExpensesPages = getTotalPages(
    expensesData?.length || 0,
    itemsPerPage
  );

  // REPORT GENERATING FUNCTIONS
  const generateWeeklyPDFReport = (salesData) => {
    if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
      showAlert("No sales data available to generate PDF.", "destructive");
      return;
    }

    // Improve weekly date filtering
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const weekSalesData = salesData.filter((sale) => {
      try {
        const saleDate = new Date(sale.date_transacted);
        // Set hours to midnight for consistent comparison
        saleDate.setHours(0, 0, 0, 0);
        oneWeekAgo.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);

        return saleDate >= oneWeekAgo && saleDate <= today;
      } catch (error) {
        console.error("Date parsing error:", error);
        return false;
      }
    });

    if (weekSalesData.length === 0) {
      showAlert("No sales data available for the past week.", "destructive");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    doc.setFont("helvetica");
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    const availableWidth = pageWidth - margin * 2;

    const currentDate = new Date();
    const formattedCurrentDate = format(
      currentDate,
      "MMMM dd, yyyy"
    ).toUpperCase();
    const formattedDateForFilename = format(currentDate, "MMMM_dd_yyyy");

    const startDateFormatted = format(oneWeekAgo, "MMMM dd").toUpperCase();
    const endDateFormatted = format(today, "MMMM dd, yyyy").toUpperCase();

    doc.setFont("helvetica", "bold");
    doc.text(
      `BEAUTOX WEEKLY SALES REPORT (${startDateFormatted} - ${endDateFormatted})`,
      pageWidth / 2,
      margin + 30,
      { align: "center" }
    );

    const currentTimestamp = format(new Date(), "hh:mm a").toUpperCase();
    doc.text(`AS OF ${currentTimestamp}`, pageWidth / 2, margin + 50, {
      align: "center"
    });

    doc.setFontSize(16);

    const baseColumns = [
      { header: "CLIENT", width: 80 },
      { header: "PIC", width: 60 },
      { header: "DATE", width: 60 },
      { header: "MODE", width: 40 },
      { header: "PKG", width: 70 },
      { header: "TREATMENT", width: 90 },
      { header: "TOTAL", width: 60 },
      { header: "REF#", width: 70 }
    ];

    const naturalWidth = baseColumns.reduce((sum, col) => sum + col.width, 0);
    const scaleFactor = availableWidth / naturalWidth;

    const headers = baseColumns.map((col) => ({
      header: col.header,
      width: col.width * scaleFactor
    }));

    const formatCurrency = (amount) => {
      if (!amount || isNaN(amount) || parseFloat(amount) === 0) return "P0";
      const num = Math.abs(Math.round(parseFloat(amount)));
      const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `P${formatted}`;
    };

    const formatPaymentMethod = (method) => {
      if (!method) return "N/A";
      return method.toLowerCase().includes("full") ? "FULL" : "INST";
    };

    const tableData = weekSalesData.map((sale) => [
      (sale.client || "N/A").toUpperCase(),
      (sale.person_in_charge || "N/A").toUpperCase(),
      sale.date_transacted
        ? format(new Date(sale.date_transacted), "MM/dd/yy").toUpperCase()
        : "N/A",
      formatPaymentMethod(sale.payment_method),
      (sale.packages || "N/A").toUpperCase(),
      (sale.treatment || "N/A").toUpperCase(),
      formatCurrency(sale.payment),
      (sale.reference_no || "N/A").toUpperCase()
    ]);

    autoTable(doc, {
      head: [headers.map((h) => h.header)],
      body: tableData,
      startY: margin + 70,
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
        6: { halign: "right", cellPadding: { right: 5 } }
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
        valign: "middle",
        lineWidth: 0
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
          data.column.index !== 6
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

    const totalAmount = weekSalesData.reduce((sum, sale) => {
      const amount = parseFloat(sale.payment) || 0;
      return sum + amount;
    }, 0);

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL WEEKLY SALES:", margin, finalY);
    doc.text(formatCurrency(totalAmount), pageWidth - margin, finalY, {
      align: "right"
    });

    doc.setLineWidth(0.5);
    doc.line(margin, finalY + 10, pageWidth - margin, finalY + 10);

    const startDateFilename = format(oneWeekAgo, "MMdd");
    const endDateFilename = format(today, "MMdd");
    doc.save(
      `Beautox_WeeklySalesReport_${startDateFilename}_${endDateFilename}.pdf`
    );
  };

  const generateWeeklyExcelReport = (salesData) => {
    if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
      showAlert(
        "No sales data available to generate Excel file.",
        "destructive"
      );
      return;
    }

    // Use the same improved date filtering
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const weekSalesData = salesData.filter((sale) => {
      try {
        const saleDate = new Date(sale.date_transacted);
        // Set hours to midnight for consistent comparison
        saleDate.setHours(0, 0, 0, 0);
        oneWeekAgo.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);

        return saleDate >= oneWeekAgo && saleDate <= today;
      } catch (error) {
        console.error("Date parsing error:", error);
        return false;
      }
    });

    if (weekSalesData.length === 0) {
      showAlert("No sales data available for the past week.", "destructive");
      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Format timestamp and dates for title
    const currentTimestamp = format(
      new Date(),
      "MMMM dd, yyyy 'at' hh:mm a"
    ).toUpperCase();
    const startDateFormatted = format(oneWeekAgo, "MMMM dd").toUpperCase();
    const endDateFormatted = format(today, "MMMM dd, yyyy").toUpperCase();

    // Format currency function
    const formatCurrency = (amount) => {
      if (!amount || isNaN(amount)) return 0;
      return parseFloat(amount);
    };

    // Sales Sheet with title and data
    const titleRow = [
      `BEAUTOX WEEKLY SALES REPORT (${startDateFormatted} - ${endDateFormatted})`
    ];
    const timestampRow = [`AS OF ${currentTimestamp}`];
    const emptyRow = [""];
    const headerRow = [
      "Client",
      "Person In Charge",
      "Date",
      "Payment Method",
      "Package",
      "Treatment",
      "Payment",
      "Reference #"
    ];

    const salesSheetData = [
      titleRow,
      timestampRow,
      emptyRow,
      headerRow,
      ...weekSalesData.map((sale) => [
        (sale.client || "N/A").toUpperCase(),
        (sale.person_in_charge || "N/A").toUpperCase(),
        format(new Date(sale.date_transacted), "MM/dd/yyyy"),
        (sale.payment_method || "N/A").toUpperCase(),
        (sale.packages || "N/A").toUpperCase(),
        (sale.treatment || "N/A").toUpperCase(),
        formatCurrency(sale.payment),
        (sale.reference_no || "N/A").toUpperCase()
      ])
    ];

    const ws_sales = XLSX.utils.aoa_to_sheet(salesSheetData);

    // Set column widths
    ws_sales["!cols"] = [
      { wch: 25 }, // Client
      { wch: 20 }, // Person In Charge
      { wch: 12 }, // Date
      { wch: 15 }, // Payment Method
      { wch: 20 }, // Package
      { wch: 25 }, // Treatment
      { wch: 15 }, // Payment
      { wch: 15 } // Reference #
    ];

    // Style the title (merge cells for title)
    ws_sales["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Merge cells for title
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } } // Merge cells for timestamp
    ];

    // Add Summary section
    const totalAmount = weekSalesData.reduce(
      (sum, sale) => sum + formatCurrency(sale.payment),
      0
    );

    const summaryData = [
      [],
      ["Weekly Sales Summary"],
      [],
      ["Total Weekly Sales", totalAmount],
      ["Date Range", `${startDateFormatted} - ${endDateFormatted}`],
      ["Report Generated", currentTimestamp]
    ];

    const ws_summary = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths for summary
    ws_summary["!cols"] = [
      { wch: 20 }, // Labels
      { wch: 30 } // Values
    ];

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, ws_sales, "Weekly Sales");
    XLSX.utils.book_append_sheet(wb, ws_summary, "Summary");

    // Generate filename
    const startDateFilename = format(oneWeekAgo, "MMdd");
    const endDateFilename = format(today, "MMdd");
    const fileName = `Beautox_WeeklySalesReport_${startDateFilename}_${endDateFilename}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  const generateMonthlyPDFReport = (salesData, expensesData) => {
    if (!salesData || salesData.length === 0) {
      console.error("No sales data available to generate Monthly Report.");
      showAlert(
        "No sales data available to generate Monthly Report.",
        "destructive"
      );
      return;
    }

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter sales data to only show current month
    const currentMonthSales = salesData.filter((sale) => {
      const saleDate = new Date(sale.date_transacted);
      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    // Set document properties
    doc.setFont("helvetica");
    doc.setFontSize(16);

    // Page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    const availableWidth = pageWidth - margin * 2;

    // Format current date
    const formattedCurrentDate = format(
      currentDate,
      "MMMM dd, yyyy"
    ).toUpperCase();
    const formattedDateForFilename = format(currentDate, "MMMM_dd_yyyy");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.text(
      `BEAUTOX PRISM MONTHLY PROFIT REPORT AS OF ${formattedCurrentDate}`,
      pageWidth / 2,
      margin + 30,
      { align: "center" }
    );

    // Add timestamp line
    const currentTimestamp = format(new Date(), "hh:mm a").toUpperCase();
    doc.text(
      `AS OF ${currentTimestamp}`,
      pageWidth / 2,
      margin + 50, // Position it 20 points below the title
      { align: "center" }
    );

    // Reset font size for rest of document
    doc.setFontSize(16);

    // Manual currency formatting function
    const formatCurrency = (amount) => {
      if (!amount || isNaN(amount) || parseFloat(amount) === 0) return "P0";
      const num = Math.abs(Math.round(parseFloat(amount)));
      const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `P${formatted}`;
    };

    // Format payment method - match weekly report format
    const formatPaymentMethod = (method) => {
      if (!method) return "N/A";
      return method.toLowerCase().includes("full") ? "FULL" : "INST"; // Shortened to match weekly report
    };

    // 1. FIRST ADD SALES TABLE - List all sales for the current month
    doc.setFontSize(14);
    doc.text("MONTHLY SALES", pageWidth / 2, margin + 70, { align: "center" });

    // Define base column configuration (matching weekly report)
    const baseColumns = [
      { header: "CLIENT", width: 80 },
      { header: "PIC", width: 60 },
      { header: "DATE", width: 60 },
      { header: "MODE", width: 40 },
      { header: "PKG", width: 70 },
      { header: "TREATMENT", width: 90 },
      { header: "TOTAL", width: 60 },
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

    // Sales table data - formatted like weekly report
    const salesTableData = currentMonthSales.map((sale) => [
      (sale.client || "N/A").toUpperCase(),
      (sale.person_in_charge || "N/A").toUpperCase(),
      sale.date_transacted
        ? format(new Date(sale.date_transacted), "MM/dd/yy").toUpperCase()
        : "N/A",
      formatPaymentMethod(sale.payment_method),
      (sale.packages || "N/A").toUpperCase(),
      (sale.treatment || "N/A").toUpperCase(),
      formatCurrency(sale.payment),
      (sale.reference_no || "N/A").toUpperCase()
    ]);

    // Draw sales table using same styling as weekly report
    autoTable(doc, {
      head: [headers.map((h) => h.header)],
      body: salesTableData,
      startY: margin + 90,
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
        6: { halign: "right", cellPadding: { right: 5 } } // Total amount column
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
        valign: "middle",
        lineWidth: 0 // Remove header borders
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
          data.column.index !== 6
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

    // 2. THEN ADD EXPENSES TABLE (after sales table)
    // Compute expense totals grouped by category
    const computeExpenseCategoryTotals = () => {
      return expensesData.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        const value = parseFloat(expense.expense);
        acc[category] = (acc[category] || 0) + (isNaN(value) ? 0 : value);
        return acc;
      }, {});
    };

    // Get the Y position after the sales table
    const salesTableEndY = doc.lastAutoTable.finalY + 20;

    // Add expenses title
    doc.setFontSize(14);
    doc.text("MONTHLY EXPENSES", pageWidth / 2, salesTableEndY, {
      align: "center"
    });

    // Prepare expenses data
    const expenseCategoryTotals = computeExpenseCategoryTotals();
    const expensesTableData = Object.entries(expenseCategoryTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, amount]) => [
        category.toUpperCase(),
        formatCurrency(amount)
      ]);

    // Draw expenses table with matching styling
    autoTable(doc, {
      head: [["CATEGORY", "AMOUNT"]],
      body: expensesTableData,
      startY: salesTableEndY + 20,
      margin: { top: margin, right: margin, bottom: margin, left: margin },
      columnStyles: {
        0: {
          cellWidth: availableWidth * 0.7,
          halign: "left",
          fontSize: 8,
          fontStyle: "normal"
        },
        1: {
          cellWidth: availableWidth * 0.3,
          halign: "right",
          fontSize: 8,
          fontStyle: "normal"
        }
      },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
        cellWidth: "wrap",
        valign: "middle"
      },
      headStyles: {
        fillColor: "#381B4C",
        textColor: "#FFFFFF",
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: "#F8F8F8"
      }
    });

    // 3. SUMMARY SECTION
    // Compute total sales and expenses
    const computeTotalSales = () => {
      return salesData.reduce((sum, sale) => {
        const rawPayment =
          sale.payment || sale.totalAmount || sale.total_amount;
        const numericPayment = parseFloat(rawPayment);
        return sum + (isNaN(numericPayment) ? 0 : numericPayment);
      }, 0);
    };

    const totalSales = computeTotalSales();
    const monthlyExpenses = Object.values(expenseCategoryTotals).reduce(
      (total, val) => total + val,
      0
    );
    const totalProfit = totalSales - monthlyExpenses;

    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    // Add total sales
    doc.text("TOTAL SALES:", margin, finalY);
    doc.text(formatCurrency(totalSales), pageWidth - margin, finalY, {
      align: "right"
    });

    // Add total expenses
    doc.text("TOTAL EXPENSES:", margin, finalY + 20);
    doc.text(formatCurrency(monthlyExpenses), pageWidth - margin, finalY + 20, {
      align: "right"
    });

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(margin, finalY + 30, pageWidth - margin, finalY + 30);

    // Add final total
    doc.setFontSize(12);
    doc.text(
      totalProfit < 0 ? "TOTAL LOSS:" : "TOTAL PROFIT:",
      margin,
      finalY + 50
    );
    doc.text(
      formatCurrency(Math.abs(totalProfit)),
      pageWidth - margin,
      finalY + 50,
      {
        align: "right"
      }
    );

    // Save the PDF
    doc.save(`Beautox_MonthlySalesReport_${formattedDateForFilename}.pdf`);
  };

  const generateMonthlyExcelReport = (salesData, expensesData) => {
    if (!salesData || salesData.length === 0) {
      showAlert(
        "No sales data available to generate Excel file.",
        "destructive"
      );
      return;
    }

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Format timestamp for title
    const currentTimestamp = format(
      new Date(),
      "MMMM dd, yyyy 'at' hh:mm a"
    ).toUpperCase();

    // Filter sales data for current month
    const currentMonthSales = salesData.filter((sale) => {
      const saleDate = new Date(sale.date_transacted);
      return (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      );
    });

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Format currency function
    const formatCurrency = (amount) => {
      if (!amount || isNaN(amount)) return 0;
      return parseFloat(amount);
    };

    // 1. Sales Sheet with title
    const titleRow = [`BEAUTOX MONTHLY DATA AS OF ${currentTimestamp}`];
    const emptyRow = [""];
    const headerRow = [
      "Client",
      "Person In Charge",
      "Date",
      "Payment Method",
      "Package",
      "Treatment",
      "Payment",
      "Reference #"
    ];

    const salesSheetData = [
      titleRow,
      emptyRow,
      headerRow,
      ...currentMonthSales.map((sale) => [
        (sale.client || "N/A").toUpperCase(),
        (sale.person_in_charge || "N/A").toUpperCase(),
        format(new Date(sale.date_transacted), "MM/dd/yyyy"),
        (sale.payment_method || "N/A").toUpperCase(),
        (sale.packages || "N/A").toUpperCase(),
        (sale.treatment || "N/A").toUpperCase(),
        formatCurrency(sale.payment),
        (sale.reference_no || "N/A").toUpperCase()
      ])
    ];

    const ws_sales = XLSX.utils.aoa_to_sheet(salesSheetData);

    // Set column widths for sales sheet
    ws_sales["!cols"] = [
      { wch: 25 }, // Client
      { wch: 20 }, // Person In Charge
      { wch: 12 }, // Date
      { wch: 15 }, // Payment Method
      { wch: 20 }, // Package
      { wch: 25 }, // Treatment
      { wch: 15 }, // Payment
      { wch: 15 } // Reference #
    ];

    // 2. Expenses Sheet
    const expenseSheetData = expensesData.map((expense) => ({
      Date: format(new Date(expense.date), "MM/dd/yyyy"),
      Category: (expense.category || "N/A").toUpperCase(),
      Amount: formatCurrency(expense.expense)
    }));

    const ws_expenses = XLSX.utils.json_to_sheet(expenseSheetData);

    // Set column widths for expenses sheet
    ws_expenses["!cols"] = [
      { wch: 12 }, // Date
      { wch: 20 }, // Category
      { wch: 15 } // Amount
    ];

    // 3. Summary Sheet
    const totalSales = currentMonthSales.reduce(
      (sum, sale) => sum + formatCurrency(sale.payment),
      0
    );

    const totalExpenses = expensesData.reduce(
      (sum, expense) => sum + formatCurrency(expense.expense),
      0
    );

    const summaryData = [
      ["Monthly Financial Summary"],
      [],
      ["Total Sales", totalSales],
      ["Total Expenses", totalExpenses],
      ["Net Income", totalSales - totalExpenses]
    ];

    const ws_summary = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths for summary sheet
    ws_summary["!cols"] = [
      { wch: 20 }, // Labels
      { wch: 15 } // Values
    ];

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, ws_sales, "Sales");
    XLSX.utils.book_append_sheet(wb, ws_expenses, "Expenses");
    XLSX.utils.book_append_sheet(wb, ws_summary, "Summary");

    // Generate filename with current date
    const dateStr = format(currentDate, "MMM_dd_yyyy").toUpperCase();
    const fileName = `Beautox_MonthlyReport_${dateStr}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  // Category management functions
  const refreshCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error refreshing categories data:", error);
      showAlert("Error refreshing categories data", "destructive");
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: categoryData.id, name: categoryData.name }
      ]);
      await refreshCategories();
      closeModal();
    } catch (error) {
      console.error("Create category error:", error);
      showAlert("Create category error", "destructive");
    }
  };

  // FOR HANDLING OF THE LAST PAGE OF THE CATEGORIES TABLE
  const [categoriesPage, setCategoriesPage] = useState(1);
  const categoriesPerPage = 7;

  // Calculate paginated categories
  const indexOfLastCategory = categoriesPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const paginatedCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);

  // Paginate function for categories
  const paginateCategories = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalCategoryPages) {
      setCategoriesPage(pageNumber);
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      console.log("Edit category callback called with:", categoryData);
      const isDuplicate = categories.some(
        (category) =>
          category.id !== categoryData.id &&
          category.name.toLowerCase() === categoryData.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        showAlert("A category with this name already exists", "destructive");
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryData.name })
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating category");
      }
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryData.id
            ? { ...category, name: categoryData.name }
            : category
        )
      );
      closeModal();
    } catch (error) {
      console.error("Edit category error:", error);
      showAlert(
        error.message || "An error occurred while updating the category",
        "destructive"
      );
    }
  };

  const handleArchiveCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}/archive`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" }
        }
      );
      if (response.ok) {
        await refreshCategories();
        closeModal();
      } else {
        const errorData = await response.json();
        showAlert(
          errorData.message || "Error archiving category",
          "destructive"
        );
      }
    } catch (error) {
      console.error("Archive category error:", error);
      showAlert("An error occurred. Please try again.", "destructive");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleCreateExpense = async (expenseData) => {
    try {
      console.log("Creating new expense:", expenseData);
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData)
      });
      console.log("Create response status:", response.status);
      if (response.ok) {
        const result = await response.json();
        console.log("Create result:", result);
        if (result.success) {
          const newExpense = {
            id: result.id,
            ...expenseData,
            archived: false
          };
          setExpensesData((prevExpenses) => [newExpense, ...prevExpenses]);
          await refreshAllFinancialData(); // This will update expenses, financial data and chart
          closeModal();
        } else {
          showAlert(result.message || "Error creating expense", "destructive");
        }
      } else {
        const errorData = await response.json();
        console.error("Create error response:", errorData);
        showAlert(
          errorData.message || "Error creating expense. Please try again.",
          "destructive"
        );
      }
    } catch (error) {
      console.error("Create expense error:", error);
      showAlert("An error occurred. Please try again.", "destructive");
    }
  };

  const handleEditClick = (expense) => {
    const formattedExpense = {
      amount: expense.expense,
      category: expense.category,
      date: expense.date.split("T")[0]
    };
    setExpenseToEdit({
      ...formattedExpense,
      id: expense.id
    });
    openModal("editMonthlyExpense");
  };

  const handleEditExpense = async (updatedData) => {
    try {
      console.log("Submitting updated expense data:", updatedData);
      const formattedData = {
        expense: parseFloat(updatedData.amount),
        category: updatedData.category,
        date: updatedData.date
      };
      console.log("Formatted data for API:", formattedData);
      console.log("Expense ID being edited:", expenseToEdit.id);
      const response = await fetch(`${API_BASE_URL}/api/manage-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "expenses_tracker",
          id: expenseToEdit.id,
          action: "edit",
          data: formattedData
        })
      });
      console.log("API response status:", response.status);
      if (response.ok) {
        await refreshAllFinancialData(); // This will update expenses, financial data and chart
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Edit error response:", errorData);
        showAlert(errorData.message || "Error editing expense", "destructive");
      }
    } catch (error) {
      console.error("Edit expense error:", error);
      showAlert("An error occurred while editing the expense", "destructive");
    }
  };

  const handleArchiveExpense = async () => {
    try {
      console.log("Archiving expense with ID:", selectedExpense.id);
      const response = await fetch(`${API_BASE_URL}/api/manage-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "expenses_tracker",
          id: selectedExpense.id,
          action: "archive"
        })
      });
      console.log("Archive response status:", response.status);

      if (response.ok) {
        await refreshAllFinancialData(); // This will update expenses, financial data and chart
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Archive error response:", errorData);
        showAlert(
          errorData.message || "Error archiving expense",
          "destructive"
        );
      }
    } catch (error) {
      console.error("Archive expense error:", error);
      showAlert("An error occurred. Please try again.", "destructive");
    }
  };

  // 1. First, add a function to refresh financial overview data
  const refreshFinancialData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-overview`);
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      console.error("Error refreshing financial data:", error);
      showAlert("Error refreshing financial summary", "destructive");
    }
  };

  // 2. Add a function to refresh the BeautoxPieChart
  const refreshPieChart = () => {
    // Create and dispatch a custom event that BeautoxPieChart will listen for
    const refreshEvent = new CustomEvent("refresh-pie-chart");
    window.dispatchEvent(refreshEvent);
  };

  // 3. Create a comprehensive refresh function that updates all necessary data
  const refreshAllFinancialData = async () => {
    try {
      await Promise.all([refreshExpensesData(), refreshFinancialData()]);
      refreshPieChart();
    } catch (error) {
      console.error("Error refreshing data:", error);
      showAlert("Error refreshing financial data", "destructive");
    }
  };

  return (
    <div
      className="flex flex-col text-left w-full md:w-[90%] mx-auto gap-4 px-4 md:px-0"
      data-cy="financial-overview-container"
    >
      {/* Header */}
      <div data-cy="financial-overview-header">
        <h1
          className="text-[28px] md:text-[40px] leading-[1.4] md:leading-[56px] font-bold dark:text-customNeutral-100"
          data-cy="financial-overview-title"
        >
          FINANCIAL OVERVIEW
        </h1>
        <p
          className="text-sm md:text-base dark:text-customNeutral-200"
          data-cy="financial-overview-subtitle"
        >
          Summary of finances within Beautox
        </p>
      </div>
      {/* Sales Tracker Section - Updated with isFinancialOverview prop */}
      <div data-cy="sales-chart-container" className="flex flex-col gap-4">
        <h2
          className="font-bold text-xl md:text-[2rem] dark:text-customNeutral-100"
          data-cy="sales-tracker-title"
        >
          SALES TRACKER
        </h2>
        <SalesChart
          chartConfig={chartConfig}
          financialData={financialData}
          isFinancialOverview={true} // Set this prop to true in FinancialOverview
          data-cy="sales-chart"
        />
      </div>
      <div className="flex justify-end gap-4" data-cy="filter-controls">
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value)}
          data-cy="sort-select"
        >
          <SelectTrigger
            placeholder="SORT BY"
            icon={<SortIcon />}
            data-cy="sort-trigger"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent data-cy="sort-content">
            <SelectItem value="all" data-cy="sort-option-all">
              ALL DATA
            </SelectItem>
            <SelectItem value="client" data-cy="sort-option-client">
              CLIENT NAME
            </SelectItem>
            <SelectItem value="person_in_charge" data-cy="sort-option-pic">
              PERSON IN CHARGE
            </SelectItem>
            <SelectItem value="date_transacted" data-cy="sort-option-date">
              DATE TRANSACTED
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Refactored MultiSelectFilter with apply button */}
        <MultiSelectFilter
          options={columns}
          selectedValues={selectedColumns}
          setSelectedValues={setSelectedColumns}
          placeholder="FILTER COLUMNS"
          mandatoryValues={columns
            .filter((col) => col.mandatory)
            .map((col) => col.value)}
          showApplyButton={true}
          data-cy="column-filter"
        />
      </div>
      <div
        className="w-full overflow-x-auto overflow-y-hidden"
        data-cy="sales-table-container"
      >
        <Table
          data-cy="sales-table"
          showPagination={true}
          currentPage={salesPage}
          totalPages={totalSalesPages}
          onPageChange={(page) => setSalesPage(page)}
        >
          <TableHeader data-cy="sales-table-header">
            <TableRow>
              {columns
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
            </TableRow>
          </TableHeader>
          <TableBody data-cy="sales-table-body">
            {paginatedSalesData && paginatedSalesData.length > 0 ? (
              paginatedSalesData.map((sale, index) => (
                <TableRow key={index} data-cy={`sales-row-${index}`}>
                  {columns
                    .filter((col) => selectedColumns.includes(col.value))
                    .map((column) => (
                      <TableCell
                        key={column.value}
                        className={cn(
                          "whitespace-nowrap",
                          column.value === "client"
                            ? "text-start"
                            : "text-center"
                        )}
                        data-cy={`sales-cell-${column.value}-${index}`}
                      >
                        {column.value === "date_transacted"
                          ? sale.date_transacted
                            ? format(
                                new Date(sale.date_transacted),
                                "MMMM dd, yyyy"
                              ).toUpperCase()
                            : "N/A"
                          : column.value === "payment"
                          ? new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: "PHP"
                            }).format(sale.payment)
                          : (sale[column.value] || "N/A").toUpperCase()}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={selectedColumns.length}
                  className="text-center"
                  data-cy="no-sales-data-message"
                >
                  NO SALES DATA CURRENTLY AVAILABLE
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-end" data-cy="sales-actions">
        <div
          className="inline-flex rounded-lg overflow-hidden"
          data-cy="report-buttons"
        >
          <Button
            className="rounded-none border-r border-customNeutral-300 first:rounded-l-lg text-sm md:text-base"
            data-cy="download-weekly-sales-btn"
            onClick={() => generateWeeklyExcelReport(salesData, expensesData)}
          >
            <DownloadIcon />
            <span className="hidden md:inline">DOWNLOAD WEEKLY SALES DATA</span>
            <span className="md:hidden">WEEKLY DATA</span>
          </Button>
          <Button
            variant="callToAction"
            onClick={() => generateWeeklyExcelReport(salesData, expensesData)}
            className="rounded-none last:rounded-r-lg text-sm md:text-base"
            data-cy="download-weekly-report-btn"
          >
            <DownloadIcon />
            <span className="hidden md:inline">
              DOWNLOAD WEEKLY SALES REPORT
            </span>
            <span className="md:hidden">WEEKLY REPORT</span>
          </Button>
        </div>
      </div>
      {/* Monthly Expenses Tracker Section */}
      <h2
        className="font-bold text-xl md:text-[2rem] dark:text-customNeutral-100"
        data-cy="monthly-expenses-title"
      >
        MONTHLY EXPENSES TRACKER
      </h2>
      <div
        className="grid gap-8 md:gap-14"
        data-cy="monthly-expenses-container"
      >
        <div
          className="flex flex-col md:flex-row w-full gap-8"
          data-cy="expenses-charts-section"
        >
          <div className="w-full md:w-1/2" data-cy="pie-chart-container">
            <BeautoxPieChart
              className="shadow-custom"
              data-cy="beautox-pie-chart"
            />
          </div>
          <div
            className="flex flex-col w-full md:w-1/2 gap-2"
            data-cy="categories-section"
          >
            <Table
              className="overflow-x-hidden"
              data-cy="categories-table"
              showPagination={true}
              currentPage={categoriesPage}
              totalPages={totalCategoryPages}
              onPageChange={paginateCategories}
            >
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="text-lg md:text-xl text-left font-semibold py-4"
                    data-cy="categories-table-header"
                  >
                    CURRENT CATEGORIES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-cy="categories-table-body">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      data-cy={`category-row-${category.id}`}
                    >
                      <TableCell
                        className="flex items-center justify-between gap-4 h-full w-full"
                        data-cy={`category-cell-${category.id}`}
                      >
                        {(category.name || "N/A").toUpperCase()}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            data-cy={`category-actions-${category.id}`}
                          >
                            <EllipsisIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCategory(category);
                                  openModal("editCategory");
                                }}
                                data-cy={`edit-category-${category.id}`}
                              >
                                <EditIcon />
                                <p className="font-semibold">Edit</p>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCategory(category);
                                  openModal("archiveCategory");
                                }}
                                data-cy={`archive-category-${category.id}`}
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
                      className="text-center"
                      data-cy="no-categories-message"
                    >
                      No categories available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Button
              fullWidth={true}
              onClick={() => openModal("createCategory")}
              data-cy="add-category-btn"
            >
              <PlusIcon />
              ADD NEW CATEGORY
            </Button>
          </div>
        </div>
        <div
          className="w-full overflow-x-auto overflow-y-hidden"
          data-cy="expenses-table-container"
        >
          <Table
            data-cy="expenses-table"
            showPagination={true}
            currentPage={expensesPage}
            totalPages={totalExpensesPages}
            onPageChange={(page) => setExpensesPage(page)}
          >
            <TableHeader>
              <TableRow>
                <TableHead
                  className="py-4 text-center whitespace-nowrap"
                  data-cy="expense-header-date"
                >
                  DATE
                </TableHead>
                <TableHead
                  className="py-4 text-center whitespace-nowrap"
                  data-cy="expense-header-category"
                >
                  CATEGORY
                </TableHead>
                <TableHead
                  className="py-4 text-center whitespace-nowrap"
                  data-cy="expense-header-amount"
                >
                  EXPENSE
                </TableHead>
                <TableHead data-cy="expense-header-actions"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-cy="expenses-table-body">
              {paginatedExpensesData.length > 0 ? (
                paginatedExpensesData.map((expense, index) => (
                  <TableRow
                    key={expense.id || index}
                    data-cy={`expense-row-${expense.id || index}`}
                  >
                    <TableCell
                      className="py-4 text-center whitespace-nowrap"
                      data-cy={`expense-date-${expense.id || index}`}
                    >
                      {expense.date
                        ? format(
                            new Date(expense.date),
                            "MMMM dd, yyyy"
                          ).toUpperCase()
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      className="py-4 text-center whitespace-nowrap"
                      data-cy={`expense-category-${expense.id || index}`}
                    >
                      {(expense.category || "N/A").toUpperCase()}
                    </TableCell>
                    <TableCell
                      className="py-4 text-center whitespace-nowrap"
                      data-cy={`expense-amount-${expense.id || index}`}
                    >
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(expense.expense)}
                    </TableCell>
                    <TableCell
                      className="py-4 text-center"
                      data-cy={`expense-actions-${expense.id || index}`}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          data-cy={`expense-actions-trigger-${
                            expense.id || index
                          }`}
                        >
                          <EllipsisIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => {
                                setExpenseToEdit({
                                  id: expense.id,
                                  expense: expense.expense,
                                  category: expense.category,
                                  date: expense.date.split("T")[0]
                                });
                                openModal("editMonthlyExpense");
                              }}
                              data-cy={`edit-expense-${expense.id || index}`}
                            >
                              <EditIcon />
                              <p className="font-semibold">Edit</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedExpense(expense);
                                openModal("archiveMonthlyExpense");
                              }}
                              data-cy={`archive-expense-${expense.id || index}`}
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
                    className="text-center"
                    data-cy="no-expenses-message"
                  >
                    No expenses recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div
          className="w-full flex flex-row items-center justify-around gap-4 mt-3"
          data-cy="total-profit-container"
        >
          <div
            className="h-full flex-1 w-1/3 flex flex-col p-3 py-4 gap-1 bg-faintingLight-100 dark:bg-customNeutral-500 rounded-lg shadow-custom"
            data-cy="total-sales"
          >
            <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
              TOTAL SALES
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold dark:text-customNeutral-100">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP"
              }).format(financialData.totalSales)}
            </p>
          </div>
          <div
            className="h-full flex-1 w-1/3 flex flex-col p-3 py-4 gap-1 bg-faintingLight-100 dark:bg-customNeutral-500 rounded-lg shadow-custom"
            data-cy="total-expenses"
          >
            <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
              TOTAL EXPENSES
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold dark:text-customNeutral-100">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP"
              }).format(financialData.totalExpenses)}
            </p>
          </div>
          <div
            className="h-full flex-1 w-1/3 flex flex-col p-3 py-4 gap-1 bg-faintingLight-100 dark:bg-customNeutral-500 rounded-lg shadow-custom"
            data-cy="total-profit-loss"
          >
            <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
              {financialData.netIncome >= 0 ? "TOTAL PROFIT" : "TOTAL LOSS"}
            </span>
            <div className="flex items-center gap-1">
              <p
                className={cn(
                  "text-xl sm:text-2xl md:text-3xl font-semibold",
                  financialData.netIncome >= 0
                    ? "text-success-500 dark:text-success-400"
                    : "text-error-500 dark:text-error-400"
                )}
              >
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP"
                }).format(Math.abs(financialData.netIncome))}
              </p>
              {financialData.netIncome >= 0 ? (
                <TrendUpIcon className="w-6 h-6 text-success-500 dark:text-success-400" />
              ) : (
                <TrendDownIcon className="w-6 h-6 text-error-500 dark:text-error-400" />
              )}
            </div>
          </div>
        </div>
        <div
          className="flex flex-col md:flex-row justify-end gap-4 pb-10"
          data-cy="bottom-actions"
        >
          <Button
            onClick={() => openModal("createMonthlyExpense")}
            className="w-full md:w-auto"
            data-cy="add-expense-btn"
          >
            <PlusIcon />
            ADD ADDITIONAL EXPENSES
          </Button>

          {/* Updated button group with unified rounded corners */}
          <div
            className="inline-flex rounded-lg overflow-hidden"
            data-cy="report-buttons"
          >
            <Button
              data-cy="download-monthly-sales-btn"
              className="rounded-none border-r border-customNeutral-300 first:rounded-l-lg"
              onClick={() =>
                generateMonthlyExcelReport(salesData, expensesData)
              }
            >
              <DownloadIcon />
              <span className="hidden md:inline">DOWNLOAD PROFIT DATA</span>
              <span className="md:hidden">PROFIT DATA</span>
            </Button>
            <Button
              onClick={() => generateMonthlyPDFReport(salesData, expensesData)}
              className="rounded-none last:rounded-r-lg"
              data-cy="download-monthly-report-btn"
            >
              <DownloadIcon />
              <span className="hidden md:inline">
                DOWNLOAD MONTHLY PROFIT REPORT
              </span>
              <span className="md:hidden">MONTHLY REPORT</span>
            </Button>
          </div>
        </div>
      </div>
      {currentModal === "createMonthlyExpense" && (
        <CreateMonthlyExpense
          isOpen={true}
          onClose={closeModal}
          onCreateSuccess={handleCreateExpense}
          categories={categories}
          data-cy="create-monthly-expense-modal"
        />
      )}
      {currentModal === "editMonthlyExpense" && expenseToEdit && (
        <EditMonthlyExpense
          isOpen={true}
          onClose={closeModal}
          onEditSuccess={handleEditExpense}
          categories={categories}
          initialData={{
            amount: expenseToEdit.expense,
            category: expenseToEdit.category,
            date: expenseToEdit.date
          }}
          data-cy="edit-monthly-expense-modal"
        />
      )}
      {currentModal === "archiveMonthlyExpense" && selectedExpense && (
        <ArchiveMonthlyExpense
          isOpen={true}
          onClose={closeModal}
          onArchive={handleArchiveExpense}
          data-cy="delete-monthly-expense-modal"
        />
      )}
      {currentModal === "createCategory" && (
        <CreateCategory
          isOpen={true}
          onClose={closeModal}
          onCreateSuccess={handleCreateCategory}
          categories={categories}
          data-cy="create-category-modal"
        />
      )}
      {currentModal === "editCategory" && (
        <EditCategory
          isOpen={true}
          onClose={closeModal}
          category={selectedCategory}
          onEditSuccess={handleEditCategory}
          data-cy="edit-category-modal"
        />
      )}
      {currentModal === "archiveCategory" && (
        <ArchiveCategory
          isOpen={true}
          onClose={closeModal}
          onArchiveSuccess={handleArchiveCategory}
          category={selectedCategory}
          data-cy="archive-category-modal"
        />
      )}
      {alert.visible && (
        <AlertContainer variant={alert.variant}>
          <AlertText>
            <AlertTitle>
              {alert.variant === "destructive" ? "Error" : "Notice"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </AlertText>
          <CloseAlert
            onClick={() =>
              setAlert({ visible: false, message: "", variant: "default" })
            }
          />
        </AlertContainer>
      )}
    </div>
  );
}

export default FinancialOverview;
