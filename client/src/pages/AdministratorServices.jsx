import React from "react";
import "../App.css";
import { CTAButton, OutlineButton, Pagination } from "../Components";
import ChevronLeftIcon from "../assets/icons/ChevronLeftIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import PackageIcon from "../assets/icons/PackageIcon";
import EllipsisIcon from "../assets/icons/EllipsisIcon";
import UserIcon from "../assets/icons/UserIcon";
import EmailIcon from "../assets/icons/EmailIcon";
import UserIDIcon from "../assets/icons/UserIDIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import AgeIcon from "../assets/icons/AgeIcon";
import ArrowNorthEastIcon from "../assets/icons/ArrowNorthEastIcon";
import EditIcon from "../assets/icons/EditIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

import { Button, buttonVariants } from "@/components/ui/Button";

function AdministratorServices() {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[2rem] leading-[44.8px] font-semibold">
        ADMINISTRATOR SERVICES
      </h4>
      <table className="PRISM-table">
        <thead>
          <tr>
            <th>PRODUCT ID</th>
            <th>PACKAGE</th>
            <th>TREATMENT</th>
            <th>SESSIONS</th>
            <th>PRICE</th>
            <th className="flex justify-center items-center h-full">
              <button className="flex items-center justify-center h-12 w-ful">
                <SettingsIcon />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>
              <button className="flex items-center justify-center h-8 w-full">
                <EllipsisIcon />
              </button>
            </td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
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
      <div className="w-full flex justify-end gap-4 mb-[10%]">
        <OutlineButton
          text="RETURN"
          leftIcon={<ChevronLeftIcon />}
          className="items-end"
        />

        <Button variant="outline">
          <ChevronLeftIcon />
          CHECK
        </Button>

        <CTAButton
          text="ADD NEW PACKAGE"
          leftIcon={<PlusIcon />}
          rightIcon={<PackageIcon />}
          className="items-end"
        />
      </div>
      <Button variant="outline">
        <ChevronLeftIcon />
        CHECK
        <ChevronLeftIcon />
      </Button>
    </div>
  );
}

export default AdministratorServices;
