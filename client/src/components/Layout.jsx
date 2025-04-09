import React from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, Outlet, useOutlet } from "react-router-dom";
import UserProfile from "./UserProfile";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // Define routes that should not show the sidebar or user profile
  const sidebarlessRoutes = ["/", "/login", "/scheduleappointment"];

  const lightThemeRoutes = [
    "/",
    "/login",
    "/scheduleappointment",
    "/landingpage"
  ];

  // List all valid routes from your App.jsx
  const validRoutes = [
    "/admindashboard",
    "/staffdashboard",
    "/patientrecordsdatabase",
    "/administratorservices",
    "/staffservices",
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

  useEffect(() => {
    const root = window.document.documentElement;

    // Check if current route should have light theme
    const shouldBeLightTheme =
      lightThemeRoutes.some(
        (route) => location.pathname.toLowerCase() === route.toLowerCase()
      ) || isErrorPage;

    if (shouldBeLightTheme) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      // For all other routes, set to dark theme
      root.classList.remove("light");
      root.classList.add("dark");
    }

    // Cleanup function
    return () => {
      // Optional: Reset to default theme when component unmounts
      // root.classList.remove('light', 'dark');
    };
  }, [location.pathname, isErrorPage]);

  // Only show the sidebar and user profile if the current route is allowed and it's not the error page
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

      <main
        className={cn(
          "w-dvw h-screen flex flex-col overflow-y-auto  dark:bg-customNeutral-700 dark:text:customNeutral-100",
          "[&::-webkit-scrollbar]:w-2.5",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-track]:!bg-transparent",
          "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-200"
        )}
      >
        {/* Fixed header with proper positioning */}
        <header className="fixed w-full flex items-center justify-between px-4 py-5 z-40">
          {/* Left side - sidebar trigger */}
          <div className="flex-shrink-0">
            {shouldShowSidebar && <SidebarTrigger />}
          </div>

          {/* Right side - user profile with fixed positioning */}
          <div className="flex-shrink-0 fixed right-4">
            {shouldShowSidebar && <UserProfile />}
          </div>
        </header>

        <div
          className={cn(
            "flex flex-col flex-1 items-center",
            !sidebarlessRoutes.includes(location.pathname.toLowerCase()) &&
              "my-16 lg:my-20"
          )}
        >
          <div className="flex flex-col flex-1 w-full gap-4">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
