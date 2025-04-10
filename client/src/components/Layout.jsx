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
    const userTheme = localStorage.getItem("vite-ui-theme");

    // Define routes that should always use light theme regardless of preference
    const forceableLightRoutes = ["/", "/login", "/scheduleappointment"];

    // Check if current route should force light theme
    const shouldForceLightTheme = forceableLightRoutes.some(
      (route) => location.pathname.toLowerCase() === route.toLowerCase()
    );

    // If on a route that must be light, force light theme temporarily
    if (shouldForceLightTheme) {
      root.classList.remove("dark");
      root.classList.add("light");
      return;
    }

    // Otherwise respect the user's theme preference
    // This will be handled by ThemeProvider, so we don't need to do anything else
  }, [location.pathname]);

  // Only show the sidebar and user profile if the current route is allowed and it's not the error page
  const shouldShowSidebar =
    !sidebarlessRoutes.includes(location.pathname.toLowerCase()) &&
    !isErrorPage;

  // for debugging toggle theme
  useEffect(() => {
    const root = window.document.documentElement;
    const userTheme = localStorage.getItem("vite-ui-theme");
    const currentDocTheme = root.classList.contains("dark") ? "dark" : "light";
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = systemPrefersDark ? "dark" : "light";

    const shouldForceLightTheme =
      location.pathname.startsWith("/public") ||
      location.pathname === "/login" ||
      location.pathname === "/404" ||
      isErrorPage;

    console.log("📄 Layout Theme Check:");
    console.log("- Current path:", location.pathname);
    console.log("- System preference:", systemTheme);
    console.log("- User theme from storage:", userTheme);
    console.log("- Current document theme:", currentDocTheme);
    console.log("- Should force light theme:", shouldForceLightTheme);
  }, [location.pathname, isErrorPage]);

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
          "w-dvw min-h-screen flex flex-col overflow-y-auto  dark:bg-customNeutral-700 dark:text:customNeutral-100",
          "[&::-webkit-scrollbar]:w-[0.4rem]",

          "scrollbar-thin scrollbar-thumb-gray-400/70 scrollbar-track-transparent",

          /* Webkit-specific styles */
          "[&::-webkit-scrollbar:horizontal]:h-[0.4rem]",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-track]:!bg-transparent",
          "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-200",

          /* Hide scrollbar buttons/arrows */
          "[&::-webkit-scrollbar-button]:hidden",
          "[&::-webkit-scrollbar-button]:opacity-0",
          "[&::-webkit-scrollbar-button]:h-0",
          "[&::-webkit-scrollbar-button]:w-0"
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
              !isErrorPage &&
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
