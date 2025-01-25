"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/Sidebar";

import LogoutIcon from "@/assets/icons/LogoutIcon";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="LOGOUT">
          <LogoutIcon />
          <span className="flex flex-row gap-2 justify-center items-center">
            LOGOUT
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
