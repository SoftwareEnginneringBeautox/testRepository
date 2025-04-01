import React, { useEffect, useState } from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import CreateMonthlySales from "@/components/modals/CreateMonthlySales";
import EditMonthlySales from "@/components/modals/EditMonthlySales";
import DeleteMonthlySales from "@/components/modals/DeleteMonthlySales";

import { Button } from "@/components/ui/Button";

import FilterIcon from "../assets/icons/FilterIcon";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import DownloadIcon from "../assets/icons/DownloadIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";

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

  // Modal hook from the second file
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
  }, []);

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

  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const handleEditExpense = async (updatedData) => {
    try {
      const response = await fetch("/api/manage-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "expenses_tracker",
          id: expenseToEdit.id,
          action: "edit",
          data: updatedData
        })
      });

      if (response.ok) {
        refreshExpensesData(); // Refresh the table
        closeModal();
      }
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleArchiveExpense = async () => {
    try {
      const response = await fetch("/api/manage-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "expenses_tracker",
          id: selectedExpense.id,
          action: "archive"
        })
      });

      if (response.ok) {
        refreshExpensesData(); // Your existing refresh function
        closeModal();
      }
    } catch (error) {
      console.error("Archive error:", error);
    }
  };

  return (
    <div className="flex flex-col text-left w-[90%] mx-auto gap-4">
      {/* Header */}
      <div>
        <h1 className="text-[40px] leading-[56px] font-bold">
          FINANCIAL OVERVIEW
        </h1>
        <p>Summary of finances within Beautox</p>
      </div>

      {/* Sales Tracker Section */}
      <h2 className="font-bold text-[2rem]">SALES TRACKER</h2>
      <SalesChart chartData={chartData} chartConfig={chartConfig} />
      <div className="flex justify-end">
        <Select>
          <SelectTrigger placeholder="FILTER BY" icon={<FilterIcon />}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">CLIENT</TableHead>
            <TableHead className="py-4 text-center">PERSON IN CHARGE</TableHead>
            <TableHead className="py-4 text-center">DATE TRANSACTED</TableHead>
            <TableHead className="py-4 text-center">PAYMENT METHOD</TableHead>
            <TableHead className="py-4 text-center">PACKAGES</TableHead>
            <TableHead className="py-4 text-center">TREATMENT</TableHead>
            <TableHead className="py-4 text-center">PAYMENT</TableHead>
            <TableHead className="py-4 text-center">REFERENCE NO.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.length > 0 ? (
            salesData.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.client.toUpperCase()}</TableCell>
                <TableCell>{sale.person_in_charge.toUpperCase()}</TableCell>
                <TableCell>
                  {format(
                    new Date(sale.date_transacted),
                    "MMMM dd, yyyy"
                  ).toUpperCase()}
                </TableCell>
                <TableCell>{sale.payment_method.toUpperCase()}</TableCell>
                <TableCell>{sale.packages.toUpperCase()}</TableCell>
                <TableCell>{sale.treatment.toUpperCase()}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP"
                  }).format(sale.payment)}
                </TableCell>
                <TableCell>{sale.reference_no}</TableCell>
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

      <div className="w-full flex justify-end gap-4">
        <Button
          variant="callToAction"
          onClick={() => generateWeeklySalesReport(salesData)}
        >
          <DownloadIcon />
          DOWNLOAD WEEKLY SALES REPORT
        </Button>
      </div>

      {/* Monthly Expenses Tracker Section */}
      <h2 className="font-bold text-[2rem]">MONTHLY EXPENSES TRACKER</h2>
      <div className="grid gap-14">
        <div className="flex w-full gap-8">
          <div className="flex-1 w-1/2">
            <BeautoxPieChart className="shadow-custom" />
          </div>
          <div className="flex flex-col flex-1 w-1/2 h-full gap-2">
            <Table className="overflow-x-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl text-left font-semibold py-4">
                    CURRENT CATEGORIES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center justify-between gap-4 h-full">
                    CHECK 1 <DeleteIcon />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center justify-between gap-4 h-full">
                    CHECK 2 <DeleteIcon />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button fullWidth={true}>
              <PlusIcon />
              ADD NEW CATEGORY
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 text-center">DATE</TableHead>
              <TableHead className="py-4 text-center">CATEGORY</TableHead>
              <TableHead className="py-4 text-center">EXPENSE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesData.length > 0 ? (
              expensesData.map((expense, index) => (
                <TableRow key={expense.id || index}>
                  <TableCell className="py-4 text-center">
                    {format(
                      new Date(expense.date),
                      "MMMM dd, yyyy"
                    ).toUpperCase()}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {expense.category.toUpperCase()}
                  </TableCell>
                  <TableCell className="py-4 text-center">
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
                              setExpenseToEdit(expense); // Store the expense to be edited
                              openModal("editMonthlyExpense");
                            }}
                          >
                            <EditIcon />
                            <p className="font-semibold">Edit</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedExpense(expense); // Store the expense to be archived
                              openModal("deleteMonthlyExpense"); // Match your modal name
                            }}
                          >
                            <DeleteIcon />
                            <p className="font-semibold">Delete</p>
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

        <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px]">
          TOTAL PROFIT:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP"
            }).format(financialData.netIncome)}
          </span>
        </div>

        <div className="w-full flex justify-end gap-4 mb-[10%]">
          <Button variant="outline">
            <ChevronLeftIcon />
            RETURN
          </Button>
          <Button onClick={() => openModal("createMonthlyExpense")}>
            <PlusIcon />
            ADD ADDITIONAL EXPENSES
          </Button>
          <Button
            onClick={() => generateMonthlySalesReport(salesData, expensesData)}
          >
            <DownloadIcon />
            DOWNLOAD MONTHLY SALES REPORT
          </Button>
        </div>
      </div>

      {currentModal === "createMonthlyExpense" && (
        <CreateMonthlySales isOpen onClose={closeModal} />
      )}
      {currentModal === "editMonthlyExpense" && expenseToEdit && (
        <EditMonthlySales
          isOpen={true}
          onClose={closeModal}
          onEditSuccess={handleEditExpense}
          initialData={{
            amount: expenseToEdit.expense,
            category: expenseToEdit.category,
            date: expenseToEdit.date.split("T")[0] // Format date for input
          }}
        />
      )}
      {currentModal === "deleteMonthlyExpense" && (
        <DeleteMonthlySales
          isOpen={true}
          onClose={closeModal}
          onArchive={handleArchiveExpense}
        />
      )}
    </div>
  );
}

export default FinancialOverview;
