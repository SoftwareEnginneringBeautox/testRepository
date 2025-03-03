"use client";

import { useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/Sidebar";

export function NavMain({ items }) {
  const { pathname } = useLocation();
  // Define the routes where you want to hide the entire sidebar
  const hideRoutes = ["/login", "/scheduleappointment"];
  
  // If the current pathname is one of the hide routes, render nothing
  if (hideRoutes.includes(pathname.toLowerCase())) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>PRISM PAGES</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon}
              <span className="flex flex-row gap-2">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
