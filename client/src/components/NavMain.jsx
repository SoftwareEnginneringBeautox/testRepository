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
