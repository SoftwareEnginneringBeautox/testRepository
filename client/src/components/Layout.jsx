import React, { Children } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, Outlet } from "react-router-dom";
import UserProfile from "./UserProfile";

export default function Layout({ children }) {
  // const location = useLocation();
  // const sidebarlessRoutes = ["/login", "/scheduleappointment"];
  // const isSidebarVisible = !sidebarlessRoutes.includes(
  //   location.pathname.toLowerCase()
  // );

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-width-mobile": "18rem"
      }}
    >
      <AppSidebar />
      <main className="w-dvw h-screen flex flex-col">
        <SidebarTrigger />
        <div className="flex flex-col flex-1 items-center ">
          <div className="flex flex-row justify-between w-full">
            <UserProfile />
          </div>

          <div className="flex flex-col flex-1 w-full gap-4">
            {/* Outlet renders the actual page (like AdminDashboard, Fin, etc.) */}
            {/* <Outlet /> */}
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
