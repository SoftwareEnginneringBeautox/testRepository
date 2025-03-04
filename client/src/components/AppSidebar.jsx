import * as React from "react";
import { useLocation } from "react-router-dom";
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

const handleRedirectAdmin = () => {
  window.location.href = "/AdminDashboard";
};
const handleRedirectServices = () => {
  window.location.href = "/AdministratorServices";
};
const handleRedirectPatientRecords = () => {
  window.location.href = "/PatientRecordsDatabase";
};
const handleRedirectBookings = () => {
  window.location.href = "/BookingCalendar";
};
const handleRedirectFinancialOverview = () => {
  window.location.href = "/FinancialOverview";
};

const sideBarInformation = [
  {
    title: "DASHBOARD",
    url: "/AdminDashboard",
    icon: <DashboardIcon />,
    onClick: handleRedirectAdmin
  },
  {
    title: "SERVICES",
    url: "/AdministratorServices",
    icon: <TreatmentIcon />,
    onClick: handleRedirectServices
  },
  {
    title: "PATIENT RECORDS",
    url: "/PatientRecordsDatabase",
    icon: <PatientRecordsIcon />,
    onClick: handleRedirectPatientRecords
  },
  {
    title: "BOOKINGS",
    url: "/bookings",
    icon: <BookingsIcon />,
    onClick: handleRedirectBookings
  },
  {
    title: "FINANCIAL OVERVIEW",
    url: "/FinancialOverview",
    icon: <FinancesIcon />,
    onClick: handleRedirectFinancialOverview
  }
];

export function AppSidebar({ ...props }) {
  const { pathname } = useLocation();

  // Hide the sidebar on these routes
  const hideSidebarRoutes = ["/", "/login", "/scheduleappointment"];
  if (hideSidebarRoutes.includes(pathname.toLowerCase())) {
    return null;
  }

  // Retrieve the user role from localStorage and normalize it.
  const userRole = localStorage.getItem("role")?.toLowerCase();

  // Filter out the "SERVICES" item if the role is receptionist or aesthetician.
  const navItems = sideBarInformation.filter((item) => {
    if (
      item.title === "SERVICES" &&
      (userRole === "receptionist" || userRole === "aesthetician")
    ) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BeautoxLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
