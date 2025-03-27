import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, Outlet, useOutlet } from "react-router-dom";
import UserProfile from "./UserProfile";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // Define routes that should not show the sidebar
  const sidebarlessRoutes = ["/", "/login", "/scheduleappointment"];

  // List all valid routes from your App.jsx
  const validRoutes = [
    "/admindashboard",
    "/staffdashboard",
    "/patientrecordsdatabase",
    "/administratorservices",
    "/scheduleappointment",
    "/bookingcalendar",
    "/financialoverview"
  ];

  // Consider a path as an error page if it's not in the validRoutes list
  // and not in the sidebarlessRoutes list
  const isErrorPage =
    !validRoutes.some(
      (route) =>
        location.pathname.toLowerCase() === route.toLowerCase() ||
        location.pathname.toLowerCase().startsWith(route.toLowerCase() + "/")
    ) && !sidebarlessRoutes.includes(location.pathname.toLowerCase());

  // Only show the sidebar if the current route is allowed and it's not the error page
  const shouldShowSidebar =
    !sidebarlessRoutes.includes(location.pathname.toLowerCase()) &&
    !isErrorPage;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-width-mobile": "18rem"
      }}
    >
      {shouldShowSidebar && <AppSidebar />}

      <main className="w-dvw h-screen flex flex-col">
        {/* Use horizontal padding only so nothing pushes down at the top */}
        <header className="relative w-full flex items-center justify-between px-3">
          {shouldShowSidebar && <SidebarTrigger />}
          {shouldShowSidebar && <UserProfile />}
        </header>

        <div className="flex flex-col flex-1 items-center">
          <div className="flex flex-col flex-1 w-full gap-4">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
