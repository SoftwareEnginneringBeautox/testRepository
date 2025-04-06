import React, { useEffect, useState } from "react";
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

import FilterIcon from "../assets/icons/FilterIcon";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import DownloadIcon from "../assets/icons/DownloadIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import EditIcon from "@/assets/icons/EditIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";
import ArchiveIcon from "@/assets/icons/ArchiveIcon";

import SalesChart from "../components/SalesChart";
import BeautoxPieChart from "../components/BeautoxPieChart";

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

  const { currentModal, openModal, closeModal } = useModal();

  // Static chart data and config from the second file
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
          const picA = a.person_in_charge ? a.person_in_charge.toUpperCase() : "";
          const picB = b.person_in_charge ? b.person_in_charge.toUpperCase() : "";
          return picA.localeCompare(picB);
        });
        break;
      case "date_transacted":
        // Sort by date (most recent first)
        filtered = [...salesData].sort((a, b) => {
          return new Date(b.date_transacted) - new Date(a.date_transacted);
        });
        break;
      default:
        filtered = salesData;
    }

    setFilteredSalesData(filtered);
  }, [filterType, salesData]);

  // Update the initial setting of filteredSalesData when salesData changes
  useEffect(() => {
    setFilteredSalesData(salesData);
  }, [salesData]);

  // Fetch data from endpoints
  useEffect(() => {
    fetch("http://localhost:4000/financial-overview")
      .then((response) => response.json())
      .then((data) => setFinancialData(data))
      .catch((error) =>
        console.error("Error fetching financial overview:", error)
      );

    fetch("http://localhost:4000/sales")
      .then((response) => response.json())
      .then((data) => setSalesData(data))
      .catch((error) => console.error("Error fetching sales data:", error));

    fetch("http://localhost:4000/expenses")
      .then((response) => response.json())
      .then((data) => setExpensesData(data))
      .catch((error) => console.error("Error fetching expenses data:", error));

    fetch("http://localhost:4000/api/categories")
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

  const refreshExpensesData = async () => {
    try {
      const response = await fetch("http://localhost:4000/expenses");
      const data = await response.json();
      setExpensesData(data);
    } catch (error) {
      console.error("Error refreshing expenses data:", error);
    }
  };

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
        sale.client?.trim() ? sale.client.toUpperCase() : "N/A",
        sale.person_in_charge?.trim()
          ? sale.person_in_charge.toUpperCase()
          : "N/A",
        transactionDate,
        sale.payment_method?.trim() ? sale.payment_method.toUpperCase() : "N/A",
        sale.packages?.trim() ? sale.packages.toUpperCase() : "N/A",
        treatmentValue,
        paymentValue,
        sale.reference_no?.trim() ? sale.reference_no.toUpperCase() : "N/A"
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
        const category = expense.category || "Uncategorized"; // Default if no category is provided
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

    // Calculate values
    const expenseCategoryTotals = computeExpenseCategoryTotals();
    const monthlyExpenses = Object.values(expenseCategoryTotals).reduce(
      (total, val) => total + val,
      0
    );
    const totalSales = computeTotalSales();
    const totalProfit = totalSales - monthlyExpenses;

    // Create a new jsPDF instance in portrait mode
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header: Centered Report Title & Month/Year
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

    // Display each expense category and its total
    Object.entries(expenseCategoryTotals)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort categories alphabetically
      .forEach(([category, total]) => {
        doc.text(`${category.toUpperCase()}`, 10, y);
        doc.text(`PHP ${total}`, pageWidth - 10, y, { align: "right" });
        y += 10;
      });

    // Display total sales of the month so far
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL SALES", 10, y);
    doc.text(`PHP ${totalSales}`, pageWidth - 10, y, { align: "right" });

    // Draw a separator line
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);

    // Display total profit (total sales - expenses)
    y += 10;
    doc.setFontSize(14);
    doc.text("TOTAL PROFIT", 10, y);
    doc.text(`PHP ${totalProfit}`, pageWidth - 10, y, { align: "right" });

    // Generate filename with the current date
    const formattedDate = format(currentDate, "MMMM_dd_yyyy");
    const filename = `Beautox_MonthlySalesReport_${formattedDate}.pdf`;

    // Save the PDF
    doc.save(filename);
  };
  // REPORT GENERATING FUNCTIONS END HERE

  // Function to refresh categories after changes
  const refreshCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error refreshing categories data:", error);
    }
  };

  // Functions for category management
  const handleCreateCategory = async (categoryData) => {
    try {
      console.log("Create category callback called with:", categoryData);
      // The category should already be created in the database via the CreateCategory component
      // Just update the local state
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: categoryData.id, name: categoryData.name }
      ]);

      closeModal();
    } catch (error) {
      console.error("Create category error:", error);
      // Error should be handled in the CreateCategory component
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      console.log("Edit category callback called with:", categoryData);

      // Check for duplicate category names (case insensitive)
      const isDuplicate = categories.some(
        (category) =>
          category.id !== categoryData.id &&
          category.name.toLowerCase() === categoryData.name.trim().toLowerCase()
      );

      if (isDuplicate) {
        alert("A category with this name already exists");
        return;
      }

      // Call the API to update the category
      const response = await fetch(
        `http://localhost:4000/api/categories/${categoryData.id}`,
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

      // Update the local state with the edited category
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
        `http://localhost:4000/api/categories/${categoryId}/archive`,
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

  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Create new expense function
  const handleCreateExpense = async (expenseData) => {
    try {
      console.log("Creating new expense:", expenseData);

      // Call the new dedicated endpoint
      const response = await fetch("http://localhost:4000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData)
      });

      console.log("Create response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Create result:", result);

        if (result.success) {
          // Add the new expense to the UI with the correct ID from the server
          const newExpense = {
            id: result.id,
            ...expenseData,
            archived: false
          };

          // Add the new expense to the beginning of the list
          setExpensesData((prevExpenses) => [newExpense, ...prevExpenses]);

          // Close the modal
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

  // State for the expense to edit
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Handler for clicking the edit button
  const handleEditClick = (expense) => {
    // Format the expense data for the modal
    const formattedExpense = {
      amount: expense.expense,
      category: expense.category,
      date: expense.date.split("T")[0] // Format date for input element
    };

    // Set the expense state with both the formatted data and the original ID
    setExpenseToEdit({
      ...formattedExpense,
      id: expense.id
    });

    // Open the edit modal
    openModal("editMonthlyExpense");
  };

  const handleEditExpense = async (updatedData) => {
    try {
      console.log("Submitting updated expense data:", updatedData);

      // Format the data to match API expectations
      const formattedData = {
        expense: parseFloat(updatedData.amount),
        category: updatedData.category,
        date: updatedData.date
      };

      console.log("Formatted data for API:", formattedData);
      console.log("Expense ID being edited:", expenseToEdit.id);

      const response = await fetch("http://localhost:4000/api/manage-record", {
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
      console.error("Edit error:", error);
    }
  };

  const [selectedExpense, setSelectedExpense] = useState(null);

  // Handler for archive/delete action
  const handleArchiveExpense = async () => {
    try {
      console.log("Archiving expense with ID:", selectedExpense.id);

      const response = await fetch("http://localhost:4000/api/manage-record", {
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
        // remove the archived expense immediately
        setExpensesData((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== selectedExpense.id)
        );

        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Archive error response:", errorData);
      }
    } catch (error) {
      console.error("Archive error:", error);
    }
  };

  return (
    <div className="flex flex-col text-left w-full md:w-[90%] mx-auto gap-4 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-[28px] md:text-[40px] leading-[1.4] md:leading-[56px] font-bold">
          FINANCIAL OVERVIEW
        </h1>
        <p className="text-sm md:text-base">
          Summary of finances within Beautox
        </p>
      </div>

      {/* Sales Tracker Section */}
      <h2 className="font-bold text-xl md:text-[2rem]">SALES TRACKER</h2>
      <div className="w-full overflow-x-auto">
        <SalesChart chartData={chartData} chartConfig={chartConfig} />
      </div>

      <div className="flex justify-end">
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value)}
        >
          <SelectTrigger placeholder="FILTER BY" icon={<FilterIcon />}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL DATA</SelectItem>
            <SelectItem value="client">CLIENT NAME</SelectItem>
            <SelectItem value="person_in_charge">PERSON IN CHARGE</SelectItem>
            <SelectItem value="date_transacted">DATE TRANSACTED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 text-center whitespace-nowrap">
                CLIENT
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PERSON IN CHARGE
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                DATE TRANSACTED
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PAYMENT METHOD
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PACKAGES
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                TREATMENT
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                PAYMENT
              </TableHead>
              <TableHead className="py-4 text-center whitespace-nowrap">
                REFERENCE NO.
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalesData && filteredSalesData.length > 0 ? (
              filteredSalesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">
                    {sale.client ? sale.client.toUpperCase() : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.person_in_charge
                      ? sale.person_in_charge.toUpperCase()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(
                      new Date(sale.date_transacted),
                      "MMMM dd, yyyy"
                    ).toUpperCase()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.payment_method
                      ? sale.payment_method.toUpperCase()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.packages ? sale.packages.toUpperCase() : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.treatment ? sale.treatment.toUpperCase() : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(sale.payment)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.reference_no}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center">
                  NO SALES DATA CURRENTLY AVAILABLE
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex justify-end gap-4">
        <Button
          variant="callToAction"
          onClick={() => generateWeeklySalesReport(salesData)}
          className="text-sm md:text-base"
        >
          <DownloadIcon />
          <span className="hidden md:inline">DOWNLOAD WEEKLY SALES REPORT</span>
          <span className="md:hidden">WEEKLY REPORT</span>
        </Button>
      </div>

      {/* Monthly Expenses Tracker Section */}
      <h2 className="font-bold text-xl md:text-[2rem]">
        MONTHLY EXPENSES TRACKER
      </h2>
      <div className="grid gap-8 md:gap-14">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="w-full md:w-1/2">
            <BeautoxPieChart className="shadow-custom" />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <Table className="overflow-x-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg md:text-xl text-left font-semibold py-4">
                    CURRENT CATEGORIES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="flex items-center justify-between gap-4 h-full w-full">
                        {category.name ? category.name.toUpperCase() : "N/A"}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCategory(category);
                                  openModal("editCategory");
                                }}
                              >
                                <EditIcon />
                                <p className="font-semibold">Edit</p>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCategory(category);
                                  openModal("archiveCategory");
                                }}
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
                    <TableCell className="text-center">
                      No categories available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button
              fullWidth={true}
              onClick={() => openModal("createCategory")}
            >
              <PlusIcon />
              ADD NEW CATEGORY
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 text-center whitespace-nowrap">
                  DATE
                </TableHead>
                <TableHead className="py-4 text-center whitespace-nowrap">
                  CATEGORY
                </TableHead>
                <TableHead className="py-4 text-center whitespace-nowrap">
                  EXPENSE
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesData.length > 0 ? (
                expensesData.map((expense, index) => (
                  <TableRow key={expense.id || index}>
                    <TableCell className="py-4 text-center whitespace-nowrap">
                      {format(
                        new Date(expense.date),
                        "MMMM dd, yyyy"
                      ).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-4 text-center whitespace-nowrap">
                      {expense.category
                        ? expense.category.toUpperCase()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="py-4 text-center whitespace-nowrap">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(expense.expense)}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => {
                                const expense = expensesData[index];
                                console.log(
                                  "Setting expense to edit:",
                                  expense
                                );
                                setExpenseToEdit({
                                  id: expense.id,
                                  expense: expense.expense,
                                  category: expense.category,
                                  date: expense.date.split("T")[0]
                                });
                                openModal("editMonthlyExpense");
                              }}
                            >
                              <EditIcon />
                              <p className="font-semibold">Edit</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedExpense(expense);
                                openModal("deleteMonthlyExpense");
                              }}
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
                  <TableCell colSpan="4" className="text-center">
                    No expenses recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-xl md:text-3xl leading-normal md:leading-[67.2px]">
          TOTAL PROFIT:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP"
            }).format(financialData.netIncome)}
          </span>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-end gap-4 mb-[10%]">
          <Button variant="outline" className="w-full md:w-auto">
            <ChevronLeftIcon />
            RETURN
          </Button>
          <Button
            onClick={() => openModal("createMonthlyExpense")}
            className="w-full md:w-auto"
          >
            <PlusIcon />
            ADD ADDITIONAL EXPENSES
          </Button>
          <Button
            onClick={() => generateMonthlySalesReport(salesData, expensesData)}
            className="w-full md:w-auto"
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
          categories={categories} // Make sure this is passed correctly
        />
      )}

      {currentModal === "editMonthlyExpense" && expenseToEdit && (
        <EditMonthlyExpense
          isOpen={true}
          onClose={closeModal}
          onEditSuccess={handleEditExpense}
          categories={categories} // Make sure this is passed correctly
          initialData={{
            amount: expenseToEdit.expense,
            category: expenseToEdit.category,
            date: expenseToEdit.date
          }}
        />
      )}

      {currentModal === "deleteMonthlyExpense" && selectedExpense && (
        <DeleteMonthlyExpense
          isOpen={true}
          onClose={closeModal}
          onArchive={handleArchiveExpense}
        />
      )}

      {currentModal === "createCategory" && (
        <CreateCategory
          isOpen={true}
          onClose={closeModal}
          onCreateSuccess={handleCreateCategory}
          categories={categories} // Pass the current categories for duplicate checking
        />
      )}

      {currentModal === "editCategory" && (
        <EditCategory
          isOpen={true}
          onClose={closeModal}
          category={selectedCategory}
          onEditSuccess={handleEditCategory}
        />
      )}

      {currentModal === "archiveCategory" && (
        <ArchiveCategory
          isOpen={true}
          onClose={closeModal}
          onArchiveSuccess={handleArchiveCategory}
          category={selectedCategory}
        />
      )}
    </div>
  );
}

export default FinancialOverview;
