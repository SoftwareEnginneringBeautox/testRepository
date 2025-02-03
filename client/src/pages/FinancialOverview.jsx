import React from "react";
import "../App.css";
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
import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import EllipsisIcon from "@/assets/icons/EllipsisIcon";

function FinancialOverwiew() {
  return (
    <div className="flex flex-col text-left w-full gap-4">
      <div>
        <h1 className="text-[40px] leading-[56px] font-bold">
          FINANCIAL OVERVIEW
        </h1>
        <p>Summary of finances within Beautox</p>
      </div>
      <h2 className="font-bold text-[2rem]">SALES TRACKER</h2>
      <SalesChart />
      <div className="w-full flex justify-end">
        <Button>
          <FilterIcon />
          FILTER BY
        </Button>
      </div>
      <table className="PRISM-table">
        <thead>
          <tr>
            <th>CLIENT</th>
            <th>PERSON IN CHARGE</th>
            <th>DATE TRANSACTED</th>
            <th>PAYMENT METHOD</th>
            <th>PACKAGES</th>
            <th>TREATMENT</th>
            <th>PAYMENT</th>
            <th>REFERENCE NO.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1.1</td>
            <td>Data 1.2</td>
            <td>Data 1.3</td>
            <td>Data 1.4</td>
            <td>Data 1.5</td>
            <td>Data 1.6</td>
            <td>Data 1.7</td>
            <td>Data 1.8</td>
          </tr>
          <tr>
            <td>Data 2.1</td>
            <td>Data 2.2</td>
            <td>Data 2.3</td>
            <td>Data 2.4</td>
            <td>Data 2.5</td>
            <td>Data 2.6</td>
            <td>Data 2.7</td>
            <td>Data 2.8</td>
          </tr>
          <tr>
            <td>Data 3.1</td>
            <td>Data 3.2</td>
            <td>Data 3.3</td>
            <td>Data 3.4</td>
            <td>Data 3.5</td>
            <td>Data 3.6</td>
            <td>Data 3.7</td>
            <td>Data 3.8</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
      <div className="w-full flex justify-end gap-4">
        <Button variant="outline">
          <ChevronLeftIcon />
          RETURN
        </Button>
        <Button variant="callToAction">
          <DownloadIcon />
          DOWNLOAD SALES REPORT
        </Button>
      </div>
      <h2 className="font-bold text-[2rem]">MONTHLY EXPENSES TRACKER</h2>
      <div className="grid gap-14">
        <div className="flex w-full gap-8">
          <BeautoxPieChart className="shadow-custom" />
          <table className="PRISM-table">
            <thead>
              <tr>
                <th className="text-left">CATEGORIES</th>
              </tr>
            </thead>
            <tbody className="text-left">
              <tr>
                <td>CATEGORY 1</td>
              </tr>
              <tr>
                <td>CATEGORY 2</td>
              </tr>
              <tr>
                <td>CATEGORY 3</td>
              </tr>
              <tr>
                <td>CATEGORY 4</td>
              </tr>
              <tr>
                <td>CATEGORY 5</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table className="PRISM-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>CATEGORY</th>
              <th>EXPENSE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <EditIcon />
                        <p className="font-semibold">Edit</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DeleteIcon />
                        <p className="font-semibold">Delete</p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <EditIcon />
                        <p className="font-semibold">Edit</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DeleteIcon />
                        <p className="font-semibold">Delete</p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="w-full rounded-lg p-4 border-2 border-lavender-400 text-center text-3xl leading-[67.2px] ">
          TOTAL PROFIT <span className="font-bold">PHP 200,000</span>
        </div>
        <div className="w-full flex justify-end gap-4 mb-[10%]">
          <Button variant="outline">
            <ChevronLeftIcon />
            RETURN
          </Button>
          <Button>
            <PlusIcon />
            ADD ADDITIONAL EXPENSES
          </Button>
          <Button>
            <DownloadIcon />
            DOWNLOAD SALES REPORT
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinancialOverwiew;
