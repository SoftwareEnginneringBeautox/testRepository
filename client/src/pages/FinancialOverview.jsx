// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../App.css";
// import { useModal } from "@/hooks/useModal";
// import { Button } from "@/components/ui/Button";
// import SalesChart from "../components/SalesChart";
// import BeautoxPieChart from "../components/BeautoxPieChart";
// import FilterIcon from "../assets/icons/FilterIcon";
// import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
// import DownloadIcon from "../assets/icons/DownloadIcon";
// import PlusIcon from "../assets/icons/PlusIcon";
// import EditIcon from "@/assets/icons/EditIcon";
// import DeleteIcon from "@/assets/icons/DeleteIcon";
// import EllipsisIcon from "@/assets/icons/EllipsisIcon";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/Table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/DropdownMenu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   SelectTrigger,
// } from "@/components/ui/Select";

// function FinancialOverview() {
//   const [financialData, setFinancialData] = useState({
//     totalSales: 0,
//     totalExpenses: 0,
//     netIncome: 0
//   });

//   const [salesData, setSalesData] = useState([]);
//   const [expensesData, setExpensesData] = useState([]);

//   // Fetch Financial Overview (Total Sales, Expenses, Net Income)
//   useEffect(() => {
//     fetch("http://localhost:4000/financial-overview")
//       .then(response => response.json())
//       .then(data => setFinancialData(data))
//       .catch(error => console.error("Error fetching financial overview:", error));

//     // Fetch Sales Data
//     fetch("http://localhost:4000/sales")
//       .then(response => response.json())
//       .then(data => setSalesData(data))
//       .catch(error => console.error("Error fetching sales data:", error));

//     // Fetch Expenses Data
//     fetch("http://localhost:4000/expenses")
//       .then(response => response.json())
//       .then(data => setExpensesData(data))
//       .catch(error => console.error("Error fetching expenses data:", error));
//   }, []);

//   return (
//     <div className="flex flex-col text-left w-[90%] mx-auto gap-4">
//       <h1 className="text-[40px] leading-[56px] font-bold">FINANCIAL OVERVIEW</h1>
//       <p>Summary of finances within Beautox</p>

//       {/* Financial Overview Data */}
//       <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px]">
//         TOTAL SALES: <span className="font-bold">PHP {financialData.totalSales}</span> <br />
//         TOTAL EXPENSES: <span className="font-bold">PHP {financialData.totalExpenses}</span> <br />
//         NET INCOME: <span className="font-bold">PHP {financialData.netIncome}</span>
//       </div>

//       {/* Sales Tracker Section */}
//       <h2 className="font-bold text-[2rem]">SALES TRACKER</h2>
//       {/* <SalesChart /> */}

//       <div className="flex justify-end">
//         <Select>
//           <SelectTrigger placeholder="FILTER BY" icon={<FilterIcon />}>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="option1">Option 1</SelectItem>
//             <SelectItem value="option2">Option 2</SelectItem>
//             <SelectItem value="option3">Option 3</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="py-4 text-center">CLIENT</TableHead>
//             <TableHead className="py-4 text-center">PERSON IN CHARGE</TableHead>
//             <TableHead className="py-4 text-center">DATE TRANSACTED</TableHead>
//             <TableHead className="py-4 text-center">PAYMENT METHOD</TableHead>
//             <TableHead className="py-4 text-center">PACKAGES</TableHead>
//             <TableHead className="py-4 text-center">TREATMENT</TableHead>
//             <TableHead className="py-4 text-center">PAYMENT</TableHead>
//             <TableHead className="py-4 text-center">REFERENCE NO.</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {salesData.length > 0 ? (
//             salesData.map((sale, index) => (
//               <TableRow key={index}>
//                 <TableCell>{sale.client}</TableCell>
//                 <TableCell>{sale.person_in_charge}</TableCell>
//                 <TableCell>{new Date(sale.date_transacted).toLocaleDateString()}</TableCell>
//                 <TableCell>{sale.payment_method}</TableCell>
//                 <TableCell>{sale.packages}</TableCell>
//                 <TableCell>{sale.treatment}</TableCell>
//                 <TableCell>PHP {sale.payment}</TableCell>
//                 <TableCell>{sale.reference_no}</TableCell>
//               </TableRow>
//             ))
//           ) : (
//       <TableRow>
//       <TableCell colSpan="8" className="text-center">No sales data available</TableCell>
//     </TableRow>
//   )}
// </TableBody>

//       </Table>

//       <div className="w-full flex justify-end gap-4">
//         <Button variant="callToAction">
//           <DownloadIcon />
//           DOWNLOAD SALES REPORT
//         </Button>
//       </div>

//       {/* Monthly Expenses Section */}
//       <h2 className="font-bold text-[2rem]">MONTHLY EXPENSES TRACKER</h2>
//       <div className="grid gap-14">
//         <div className="flex w-full gap-8">
//           <div className="flex-1 w-1/2">
//             <BeautoxPieChart className="shadow-custom" />
//           </div>
//           <div className="flex-1 w-1/2 h-full">
//             <Table className="h-full overflow-x-hidden">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-xl text-left font-semibold py-4 ">REMINDERS</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell className="flex items-center gap-4 h-full">CHECK 1</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="flex items-center gap-4 h-full">CHECK 2</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="py-4 text-center">DATE</TableHead>
//               <TableHead className="py-4 text-center">CATEGORY</TableHead>
//               <TableHead className="py-4 text-center">EXPENSE</TableHead>
//               <TableHead></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {expensesData.length > 0 ? (
//               expensesData.map((expense, index) => (
//                 <TableRow key={expense.id || index}>
//                   <TableCell className="py-4 text-center">
//                     {new Date(expense.date).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell className="py-4 text-center">{expense.category}</TableCell>
//                   <TableCell className="py-4 text-center">PHP {expense.expense}</TableCell>
//                   <TableCell className="py-4 text-center">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger>
//                         <EllipsisIcon />
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuGroup>
//                           <DropdownMenuItem onClick={() => openModal("editMonthlyExpense", expense)}>
//                             <EditIcon />
//                             <p className="font-semibold">Edit</p>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => openModal("deleteMonthlyExpense", expense.id)}>
//                             <DeleteIcon />
//                             <p className="font-semibold">Delete</p>
//                           </DropdownMenuItem>
//                         </DropdownMenuGroup>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan="4" className="text-center">No expenses recorded</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px]">
//           TOTAL PROFIT: <span className="font-bold">PHP {financialData.netIncome}</span>
//         </div>

//         <div className="w-full flex justify-end gap-4 mb-[10%]">
//           <Button variant="outline">
//             <ChevronLeftIcon />
//             RETURN
//           </Button>
//           <Button onClick={() => openModal("createMonthlyExpense")}>
//             <PlusIcon />
//             ADD ADDITIONAL EXPENSES
//           </Button>
//           <Button>
//             <DownloadIcon />
//             DOWNLOAD SALES REPORT
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FinancialOverview;
import React, { useEffect, useState } from "react";
import axios from "axios"; // if needed (or remove if not used)
import "../App.css";
import { useModal } from "@/hooks/useModal";
import { jsPDF } from "jspdf";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/Select";

function FinancialOverview() {
  // Dynamic data states
  const [financialData, setFinancialData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netIncome: 0,
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
    { day: "Sun", currentWeek: 1900, previousWeek: 1400 },
  ];

  const chartConfig = {
    currentWeek: {
      label: "Current Week",
      color: "#381B4C", // Lavender-400
    },
    previousWeek: {
      label: "Previous Week",
      color: "#002B7F", // ReflexBlue-400
    },
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
                <TableCell>{sale.client}</TableCell>
                <TableCell>{sale.person_in_charge}</TableCell>
                <TableCell>
                  {new Date(sale.date_transacted).toLocaleDateString()}
                </TableCell>
                <TableCell>{sale.payment_method}</TableCell>
                <TableCell>{sale.packages}</TableCell>
                <TableCell>{sale.treatment}</TableCell>
                <TableCell>PHP {sale.payment}</TableCell>
                <TableCell>{sale.reference_no}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8" className="text-center">
                No sales data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full flex justify-end gap-4">
        <Button variant="callToAction">
          <DownloadIcon />
          DOWNLOAD SALES REPORT
        </Button>
      </div>

      {/* Monthly Expenses Tracker Section */}
      <h2 className="font-bold text-[2rem]">MONTHLY EXPENSES TRACKER</h2>
      <div className="grid gap-14">
        <div className="flex w-full gap-8">
          <div className="flex-1 w-1/2">
            <BeautoxPieChart className="shadow-custom" />
          </div>
          <div className="flex-1 w-1/2 h-full">
            <Table className="h-full overflow-x-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl text-left font-semibold py-4">
                    REMINDERS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-4 h-full">
                    CHECK 1
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-4 h-full">
                    CHECK 2
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {expense.category}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    PHP {expense.expense}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              openModal("editMonthlyExpense", expense)
                            }
                          >
                            <EditIcon />
                            <p className="font-semibold">Edit</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openModal("deleteMonthlyExpense", expense.id)
                            }
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
          <span className="font-bold">PHP {financialData.netIncome}</span>
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
          <Button>
            <DownloadIcon />
            DOWNLOAD SALES REPORT
          </Button>
        </div>
      </div>

      {/* Modal Rendering */}
      {currentModal === "createMonthlyExpense" && (
        <CreateMonthlySales isOpen onClose={closeModal} />
      )}
      {currentModal === "editMonthlyExpense" && (
        <EditMonthlySales isOpen onClose={closeModal} />
      )}
      {currentModal === "deleteMonthlyExpense" && (
        <DeleteMonthlySales isOpen onClose={closeModal} />
      )}
    </div>
  );
}

export default FinancialOverview;
