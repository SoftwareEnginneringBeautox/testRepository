"use client";

import { useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/Sidebar";

// Ensure your icons are imported
import DashboardIcon from "@/assets/icons/DashboardIcon";
import TreatmentIcon from "@/assets/icons/TreatmentIcon";
import PatientRecordsIcon from "@/assets/icons/PatientRecordsIcon";
import BookingsIcon from "@/assets/icons/BookingsIcon";
import FinancesIcon from "@/assets/icons/FinancesIcon";

export function NavMain({ items }) {
  const { pathname } = useLocation();
  // Define routes where the entire sidebar is hidden
  const hideRoutes = ["/login", "/scheduleappointment"];
  if (hideRoutes.includes(pathname.toLowerCase())) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>PRISM PAGES</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} onClick={item.onClick}>
              {item.icon}
              <span className="flex flex-row gap-2">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
