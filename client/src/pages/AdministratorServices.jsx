import React from "react";
import "../App.css";
import { useModal } from "@/hooks/useModal";

import CreatePackage from "@/components/modals/CreatePackage";
import EditPackage from "@/components/modals/EditPackage";
import DeletePackage from "@/components/modals/DeletePackage";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

import { Button } from "@/components/ui/Button";

import {
  InputContainer,
  InputTextField,
  InputLabel,
  InputIcon,
  Input
} from "@/components/ui/Input";

import {
  Select,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select";

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

function AdministratorServices() {
  const { currentModal, openModal, closeModal } = useModal();

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[2rem] leading-[44.8px] font-semibold">
        ADMINISTRATOR SERVICES
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-4 text-center">PRODUCT ID</TableHead>
            <TableHead className="py-4 text-center">PACKAGE</TableHead>
            <TableHead className="py-4 text-center">TREATMENT</TableHead>
            <TableHead className="py-4 text-center">SESSIONS</TableHead>
            <TableHead className="py-4 text-center">PRICE</TableHead>
            <TableHead className="py-4 text-center">
              <button className="flex items-center justify-center h-8 w-full">
                <SettingsIcon />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="py-4 text-center">1</TableCell>
            <TableCell className="py-4 text-center">2</TableCell>
            <TableCell className="py-4 text-center">3</TableCell>
            <TableCell className="py-4 text-center">4</TableCell>
            <TableCell className="py-4 text-center">5</TableCell>
            <TableCell className="py-4 text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => openModal("editPackage")}>
                      <EditIcon />
                      <p className="font-semibold">Edit</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openModal("deletePackage")}
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
      <div className="w-full flex justify-end gap-4 mb-[10%]">
        <Button variant="outline">
          <ChevronLeftIcon />
          RETURN
        </Button>

        <Button onClick={() => openModal("createPackage")}>
          <PlusIcon />
          ADD NEW PACKAGE
          <PackageIcon />
        </Button>
      </div>
      <InputContainer>
        <InputLabel>Eli Dizon</InputLabel>
        <InputTextField>
          <InputIcon>
            <PlusIcon />
          </InputIcon>
          <Input placeholder=":test:" />
        </InputTextField>
      </InputContainer>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="FILTER BY" />
          <SelectIcon>
            <ArrowNorthEastIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">LIGHT </SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      {currentModal === "createPackage" && (
        <CreatePackage isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "editPackage" && (
        <EditPackage isOpen={true} onClose={closeModal} />
      )}
      {currentModal === "deletePackage" && (
        <DeletePackage
          isOpen={currentModal === "deletePackage"}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default AdministratorServices;
