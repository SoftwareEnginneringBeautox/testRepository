import React from "react";
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
import BeautoxPieChart from "../components/BeautoxPieChart";
import SalesChart from "../components/SalesChart";
import PlusIcon from "../assets/icons/PlusIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/Table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from "@/components/ui/Select";

import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";

function FinancialOverwiew() {
  const { currentModal, openModal, closeModal } = useModal();
  return (
    <div className="flex flex-col text-left w-[90%] mx-auto gap-4">
      <div>
        <h1 className="text-[40px] leading-[56px] font-bold">
          FINANCIAL OVERVIEW
        </h1>
        <p>Summary of finances within Beautox</p>
      </div>
      <h2 className="font-bold text-[2rem]">SALES TRACKER</h2>
      <SalesChart />
      <div className=" flex justify-end">
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
          <TableRow>
            <TableCell>Data 1.1</TableCell>
            <TableCell>Data 1.2</TableCell>
            <TableCell>Data 1.3</TableCell>
            <TableCell>Data 1.4</TableCell>
            <TableCell>Data 1.5</TableCell>
            <TableCell>Data 1.6</TableCell>
            <TableCell>Data 1.7</TableCell>
            <TableCell>Data 1.8</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data 2.1</TableCell>
            <TableCell>Data 2.2</TableCell>
            <TableCell>Data 2.3</TableCell>
            <TableCell>Data 2.4</TableCell>
            <TableCell>Data 2.5</TableCell>
            <TableCell>Data 2.6</TableCell>
            <TableCell>Data 2.7</TableCell>
            <TableCell>Data 2.8</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data 3.1</TableCell>
            <TableCell>Data 3.2</TableCell>
            <TableCell>Data 3.3</TableCell>
            <TableCell>Data 3.4</TableCell>
            <TableCell>Data 3.5</TableCell>
            <TableCell>Data 3.6</TableCell>
            <TableCell>Data 3.7</TableCell>
            <TableCell>Data 3.8</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="w-full flex justify-end gap-4">
        <Button variant="callToAction">
          <DownloadIcon />
          DOWNLOAD SALES REPORT
        </Button>
      </div>
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
                  <TableHead className="text-xl text-left font-semibold py-4 ">
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
                <TableRow>
                  <TableCell className="flex items-center gap-4 h-full">
                    CHECK 3
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-4 h-full">
                    CHECK 4
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
            <TableRow>
              <TableCell className="py-4 text-center">1</TableCell>
              <TableCell className="py-4 text-center">2</TableCell>
              <TableCell className="py-4 text-center">3</TableCell>
              <TableCell className="py-4 text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => openModal("editMonthlyExpense")}
                      >
                        <EditIcon />
                        <p className="font-semibold">Edit</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openModal("deleteMonthlyExpense")}
                      >
                        <DeleteIcon />
                        <p className="font-semibold">Delete</p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px] ">
          TOTAL PROFIT <span className="font-bold">PHP 200,000</span>
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
      {currentModal === "createMonthlyExpense" && (
        <CreateMonthlySales isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "editMonthlyExpense" && (
        <EditMonthlySales isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "deleteMonthlyExpense" && (
        <DeleteMonthlySales
          isOpen={currentModal === "deleteMonthlyExpense"}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default FinancialOverwiew;
