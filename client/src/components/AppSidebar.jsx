import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/Sidebar";
import { NavMain } from "@/components/NavMain";
import { NavUser } from "@/components/NavUser";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import PatientRecordsIcon from "@/assets/icons/PatientRecordsIcon";
import BookingsIcon from "@/assets/icons/BookingsIcon";
import FinancesIcon from "@/assets/icons/FinancesIcon";
import DashboardIcon from "@/assets/icons/DashboardIcon";
import BeautoxLogo from "@/assets/logos/BeautoxLogo";

const sideBarInformation = [
  {
    title: "DASHBOARD",
    url: "/AdminDashboard",
    icon: <DashboardIcon />
  },
  {
    title: "SERVICES",
    url: "/AdministratorServices",
    icon: <TreatmentIcon />
  },
  {
    title: "PATIENT RECORDS",
    url: "/PatientRecordsDatabase",
    icon: <PatientRecordsIcon />
  },
  {
    title: "BOOKINGS",
    url: "/bookings",
    icon: <BookingsIcon />
  },
  {
    title: "FINANCIAL OVERVIEW",
    url: "/FinancialOverview",
    icon: <FinancesIcon />
  }
];

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BeautoxLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideBarInformation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
