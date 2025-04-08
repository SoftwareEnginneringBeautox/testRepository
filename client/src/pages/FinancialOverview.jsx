import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import CreateMonthlyExpense from "@/components/modals/CreateMonthlyExpense";
import EditMonthlyExpense from "@/components/modals/EditMonthlyExpense";
import DeleteMonthlyExpense from "@/components/modals/DeleteMonthlyExpense";
import CreateCategory from "@/components/modals/CreateCategory";
import EditCategory from "@/components/modals/EditCategory";
import ArchiveCategory from "@/components/modals/ArchiveCategory";
import { Button } from "@/components/ui/Button";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import DownloadIcon from "../assets/icons/DownloadIcon";
import PlusIcon from "../assets/icons/PlusIcon";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/Pagination";

import { Checkbox } from "@/components/ui/Checkbox";

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
      label: "Current Week",
      color: "#381B4C" // Lavender-400
    },
    previousWeek: {
      label: "Previous Week",
      color: "#002B7F" // ReflexBlue-400
    }
  };

  const [filterType, setFilterType] = useState("all");
  const [filteredSalesData, setFilteredSalesData] = useState([]);

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
    setFilteredSalesData(salesData);
  }, [salesData]);

  // Fetch data from endpoints
  useEffect(() => {
    // 1. Financial Overview
    fetch(`${API_BASE_URL}/financial-overview`)
      .then((response) => response.json())
      .then((data) => setFinancialData(data))
      .catch((error) =>
        console.error("Error fetching financial overview:", error)
      );

    // 2. Sales data for table
    fetch(`${API_BASE_URL}/sales`)
      .then((response) => response.json())
      .then((data) => setSalesData(data))
      .catch((error) => console.error("Error fetching sales data:", error));

    // 3. Expenses data
    fetch(`${API_BASE_URL}/expenses`)
      .then((response) => response.json())
      .then((data) => setExpensesData(data))
      .catch((error) => console.error("Error fetching expenses data:", error));

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
    }
  };

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
  const generateWeeklySalesReport = (salesData) => {
    if (!salesData || salesData.length === 0) {
      console.error("No sales data available to generate PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    doc.setFont("helvetica");

    const margin = 40;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - margin * 2;
    const startY = margin + 10;

    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "MMMM dd, yyyy");
    const formattedMonthForFilename = format(
      currentDate,
      "MMMM dd, yyyy"
    ).replace(/^([a-z])/, (match) => match.toUpperCase());

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    const title = `BEAUTOX WEEKLY SALES REPORT`;
    const dateSubtitle = `AS OF ${formattedCurrentDate.toUpperCase()}`;

    doc.text(title, pageWidth / 2, margin, { align: "center" });
    doc.text(dateSubtitle, pageWidth / 2, margin + 20, { align: "center" });

    const headers = [
      "CLIENT",
      "PIC",
      "DATE",
      "PAYMENT",
      "PACKAGES",
      "TREATMENT",
      "AMOUNT",
      "REF NO"
    ];

    const tableData = salesData.map((sale) => {
      const transactionDate = sale.date_transacted
        ? format(new Date(sale.date_transacted), "MMMM dd, yyyy").toUpperCase()
        : "N/A";
      const paymentValue = (() => {
        const rawPayment =
          sale.payment || sale.totalAmount || sale.total_amount;
        const numericPayment = parseFloat(rawPayment);
        return !isNaN(numericPayment)
          ? `PHP ${numericPayment.toFixed(2)}`
          : "PHP 0.00";
      })();
      const treatmentValue =
        sale.treatment && sale.treatment.trim().length > 0
          ? sale.treatment.toUpperCase()
          : "N/A";

      return [
        (sale.client || "N/A").toUpperCase(),
        (sale.person_in_charge || "N/A").toUpperCase(),
        transactionDate,
        (sale.payment_method || "N/A").toUpperCase(),
        (sale.packages || "N/A").toUpperCase(),
        treatmentValue,
        paymentValue,
        (sale.reference_no || "N/A").toUpperCase()
      ];
    });

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY + 40,
      margin: { top: margin, left: margin, right: margin, bottom: margin },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        overflow: "linebreak",
        cellPadding: 2,
        lineWidth: 0.5,
        lineColor: "#000000"
      },
      headStyles: {
        fillColor: "#381B4C",
        textColor: "#FFFFFF",
        fontSize: 9,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
        minCellHeight: 20
      },
      bodyStyles: {
        valign: "middle",
        lineWidth: { top: 0.2, bottom: 0.2 },
        lineColor: "#000000"
      },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.15 },
        1: { cellWidth: contentWidth * 0.1 },
        2: { cellWidth: contentWidth * 0.15 },
        3: { cellWidth: contentWidth * 0.1 },
        4: { cellWidth: contentWidth * 0.15 },
        5: { cellWidth: contentWidth * 0.15 },
        6: { cellWidth: contentWidth * 0.1, halign: "right" },
        7: { cellWidth: contentWidth * 0.1 }
      },
      didDrawPage: function () {
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth - margin - 30,
          doc.internal.pageSize.height - 10
        );
      }
    });

    const totalPayment = salesData.reduce((total, sale) => {
      const payment = parseFloat(sale.payment);
      return total + (isNaN(payment) ? 0 : payment);
    }, 0);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL`, margin, doc.lastAutoTable.finalY + 20);
    doc.text(
      `PHP ${totalPayment}`,
      pageWidth - margin - 50,
      doc.lastAutoTable.finalY + 20
    );

    const filename = `Beautox_WeeklySalesReport_${formattedMonthForFilename
      .replace(/,\s/g, "_")
      .replace(/\s/g, "_")}.pdf`;
    doc.save(filename);
  };

  const generateMonthlySalesReport = (salesData, expensesData) => {
    if (!salesData || salesData.length === 0) {
      console.error("No sales data available to generate Monthly Report.");
      return;
    }
    if (!expensesData || expensesData.length === 0) {
      console.warn("No expense data available. Proceeding with zero expenses.");
    }

    // Compute expense totals grouped by category
    const computeExpenseCategoryTotals = () => {
      return expensesData.reduce((acc, expense) => {
        const category = expense.category || "Uncategorized";
        const value = parseFloat(expense.expense);
        acc[category] = (acc[category] || 0) + (isNaN(value) ? 0 : value);
        return acc;
      }, {});
    };

    // Compute total sales from salesData
    const computeTotalSales = () => {
      return salesData.reduce((sum, sale) => {
        const rawPayment =
          sale.payment || sale.totalAmount || sale.total_amount;
        const numericPayment = parseFloat(rawPayment);
        return sum + (isNaN(numericPayment) ? 0 : numericPayment);
      }, 0);
    };

    const expenseCategoryTotals = computeExpenseCategoryTotals();
    const monthlyExpenses = Object.values(expenseCategoryTotals).reduce(
      (total, val) => total + val,
      0
    );
    const totalSales = computeTotalSales();
    const totalProfit = totalSales - monthlyExpenses;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const reportTitle = "BEAUTOX PRISM MONTHLY SALES REPORT";
    const currentDate = new Date();
    const reportMonth = format(currentDate, "MMMM yyyy").toUpperCase();
    doc.text(reportTitle, pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(reportMonth, pageWidth / 2, 28, { align: "center" });

    let y = 40;
    doc.setFont("helvetica", "normal");

    Object.entries(expenseCategoryTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([category, total]) => {
        doc.text(`${category.toUpperCase()}`, 10, y);
        doc.text(`PHP ${total}`, pageWidth - 10, y, { align: "right" });
        y += 10;
      });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL SALES", 10, y);
    doc.text(`PHP ${totalSales}`, pageWidth - 10, y, { align: "right" });

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);

    y += 10;
    doc.setFontSize(14);
    doc.text("TOTAL PROFIT", 10, y);
    doc.text(`PHP ${totalProfit}`, pageWidth - 10, y, { align: "right" });

    const formattedDate = format(currentDate, "MMMM_dd_yyyy");
    const filename = `Beautox_MonthlySalesReport_${formattedDate}.pdf`;

    doc.save(filename);
  };

  // Category management functions
  const refreshCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error refreshing categories data:", error);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: categoryData.id, name: categoryData.name }
      ]);
      closeModal();
    } catch (error) {
      console.error("Create category error:", error);
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
        alert("A category with this name already exists");
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
      alert(error.message || "An error occurred while updating the category");
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
        alert(errorData.message || "Error archiving category");
      }
    } catch (error) {
      console.error("Archive category error:", error);
      alert("An error occurred. Please try again.");
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
          closeModal();
        } else {
          alert(result.message || "Error creating expense");
        }
      } else {
        const errorData = await response.json();
        console.error("Create error response:", errorData);
        alert(errorData.message || "Error creating expense. Please try again.");
      }
    } catch (error) {
      console.error("Create expense error:", error);
      alert("An error occurred. Please try again.");
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
        await refreshExpensesData();
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Edit error response:", errorData);
      }
    } catch (error) {
      console.error("Edit expense error:", error);
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
        setExpensesData((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== selectedExpense.id)
        );
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Archive error response:", errorData);
      }
    } catch (error) {
      console.error("Archive expense error:", error);
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

      {/* Sales Tracker Section */}
      <h2
        className="font-bold text-xl md:text-[2rem] dark:text-customNeutral-100"
        data-cy="sales-tracker-title"
      >
        SALES TRACKER
      </h2>
      <div data-cy="sales-chart-container">
        <SalesChart
          chartData={chartData}
          chartConfig={chartConfig}
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
        />
      </div>

      <div className="w-full overflow-x-auto" data-cy="sales-table-container">
        <Table data-cy="sales-table">
          <TableHeader data-cy="sales-table-header">
            <TableRow>
              {columns
                .filter((col) => selectedColumns.includes(col.value))
                .map((column) => (
                  <TableHead
                    key={column.value}
                    className="py-4 text-center whitespace-nowrap"
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
                        className="whitespace-nowrap"
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

        {/* Sales Table Pagination */}
        {filteredSalesData && filteredSalesData.length > 0 && (
          <div className="mt-4" data-cy="sales-pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setSalesPage(Math.max(1, salesPage - 1))}
                    disabled={salesPage === 1}
                    data-cy="sales-prev-page"
                  />
                </PaginationItem>

                {(() => {
                  const pages = [];
                  let showEllipsis = false;

                  // Determine which page numbers to show
                  if (totalSalesPages <= 5) {
                    // Show all pages if 5 or fewer
                    for (let i = 1; i <= totalSalesPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // For more than 5 pages, use sliding window logic
                    if (salesPage <= 3) {
                      // Near the start: show first 4 pages
                      for (let i = 1; i <= 4; i++) {
                        pages.push(i);
                      }
                      showEllipsis = true;

                      // Last page will be added separately in next check
                    } else if (salesPage >= totalSalesPages - 2) {
                      // Near the end: show last 4 pages
                      pages.push(1); // Always show first page
                      showEllipsis = true;

                      for (
                        let i = totalSalesPages - 3;
                        i <= totalSalesPages;
                        i++
                      ) {
                        pages.push(i);
                      }
                    } else {
                      // Middle: show current page with neighbors
                      pages.push(1); // Always show first page
                      showEllipsis = true;

                      for (let i = salesPage - 1; i <= salesPage + 1; i++) {
                        pages.push(i);
                      }

                      // Add ellipsis after current page area
                      pages.push(-1); // Marker for second ellipsis
                      pages.push(totalSalesPages); // Always show last page
                    }
                  }

                  // Display the determined page numbers
                  return pages.map((pageNumber) => {
                    if (pageNumber === -1) {
                      // This is our marker for the second ellipsis
                      return (
                        <PaginationItem key="ellipsis-end">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={`page-${pageNumber}`}>
                        <PaginationLink
                          isActive={pageNumber === salesPage}
                          onClick={() => setSalesPage(pageNumber)}
                          data-cy={`sales-page-${pageNumber}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}

                {/* Show ellipsis if needed (applies only in specific cases) */}
                {totalSalesPages > 5 && salesPage <= 3 && (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Show last page if not already included in our pages array */}
                {totalSalesPages > 5 && salesPage <= 3 && (
                  <PaginationItem key={`page-${totalSalesPages}`}>
                    <PaginationLink
                      isActive={totalSalesPages === salesPage}
                      onClick={() => setSalesPage(totalSalesPages)}
                      data-cy={`sales-page-${totalSalesPages}`}
                    >
                      {totalSalesPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setSalesPage(Math.min(totalSalesPages, salesPage + 1))
                    }
                    disabled={salesPage === totalSalesPages}
                    data-cy="sales-next-page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="w-full flex justify-end gap-4" data-cy="sales-actions">
        <Button
          variant="callToAction"
          onClick={() => generateWeeklySalesReport(salesData)}
          className="text-sm md:text-base"
          data-cy="download-weekly-report-btn"
        >
          <DownloadIcon />
          <span className="hidden md:inline">DOWNLOAD WEEKLY SALES REPORT</span>
          <span className="md:hidden">WEEKLY REPORT</span>
        </Button>
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
            <Table className="overflow-x-hidden" data-cy="categories-table">
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
                {categories.length > 0 ? (
                  categories.map((category) => (
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
          className="w-full overflow-x-auto"
          data-cy="expenses-table-container"
        >
          <Table data-cy="expenses-table">
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
                                openModal("deleteMonthlyExpense");
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

          {/* Expenses Table Pagination */}
          {expensesData.length > 0 && (
            <div className="mt-4" data-cy="expenses-pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setExpensesPage(Math.max(1, expensesPage - 1))
                      }
                      disabled={expensesPage === 1}
                      className={
                        expensesPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                      data-cy="expenses-prev-page"
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalExpensesPages) }).map(
                    (_, index) => {
                      let pageNumber;

                      // Logic to determine which page numbers to show
                      if (totalExpensesPages <= 5) {
                        pageNumber = index + 1;
                      } else if (expensesPage <= 3) {
                        pageNumber = index + 1;
                      } else if (expensesPage >= totalExpensesPages - 2) {
                        pageNumber = totalExpensesPages - 4 + index;
                      } else {
                        pageNumber = expensesPage - 2 + index;
                      }

                      if (pageNumber > 0 && pageNumber <= totalExpensesPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={pageNumber === expensesPage}
                              onClick={() => setExpensesPage(pageNumber)}
                              data-cy={`expenses-page-${pageNumber}`}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                  )}

                  {totalExpensesPages > 5 &&
                    expensesPage < totalExpensesPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setExpensesPage(
                          Math.min(totalExpensesPages, expensesPage + 1)
                        )
                      }
                      disabled={expensesPage === totalExpensesPages}
                      className={
                        expensesPage === totalExpensesPages
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                      data-cy="expenses-next-page"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        <div
          className="w-full rounded-lg p-4 border-2 border-lavender-400 dark:border-lavender-100 text-center"
          data-cy="total-profit-container"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 dark:text-customNeutral-100">
            <div className="text-lg md:text-xl leading-normal">
              TOTAL SALES:{" "}
              <span className="font-bold" data-cy="total-sales-amount">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP"
                }).format(financialData.totalSales)}
              </span>
            </div>
            <div className="text-lg md:text-xl leading-normal">
              TOTAL EXPENSES:{" "}
              <span className="font-bold" data-cy="total-expenses-amount">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP"
                }).format(financialData.totalExpenses)}
              </span>
            </div>
            <div className="text-lg md:text-xl leading-normal">
              <div className="flex items-center justify-center gap-2">
                <div>=</div>
              </div>
            </div>
          </div>
          <div className="text-xl md:text-3xl leading-normal md:leading-[67.2px]">
            {financialData.netIncome < 0 ? "TOTAL LOSS: " : "TOTAL PROFIT: "}
            <span
              className={`font-bold dark:text-customNeutral-100 ${
                financialData.netIncome < 0 ? "text-error-400" : ""
              }`}
              data-cy="total-profit-amount"
            >
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP"
              }).format(Math.abs(financialData.netIncome))}
            </span>
          </div>
        </div>

        <div
          className="w-full flex flex-col md:flex-row justify-end gap-4 mb-[10%]"
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
          <Button
            onClick={() => generateMonthlySalesReport(salesData, expensesData)}
            className="w-full md:w-auto"
            data-cy="download-monthly-report-btn"
          >
            <DownloadIcon />
            <span className="hidden md:inline">
              DOWNLOAD MONTHLY SALES REPORT
            </span>
            <span className="md:hidden">MONTHLY REPORT</span>
          </Button>
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

      {currentModal === "deleteMonthlyExpense" && selectedExpense && (
        <DeleteMonthlyExpense
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
    </div>
  );
}

export default FinancialOverview;
