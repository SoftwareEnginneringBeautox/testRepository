import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, Outlet } from "react-router-dom";
import UserProfile from "./UserProfile";

export default function Layout() {
  const location = useLocation();
  const sidebarlessRoutes = ["/", "/login", "/scheduleappointment"];
  const isSidebarVisible = !sidebarlessRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-width-mobile": "18rem"
      }}
    >
      {/* Conditionally render the sidebar */}
      {isSidebarVisible && <AppSidebar />}

      <main className="w-dvw h-screen flex flex-col">
        {isSidebarVisible && <SidebarTrigger />}
        <div className="flex flex-col flex-1 items-center">
          <div className="flex flex-row justify-between w-full">
            {isSidebarVisible && <UserProfile />}
          </div>

          {/* <Outlet /> is where child routes render */}
          <div className="flex flex-col flex-1 w-full gap-4">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
