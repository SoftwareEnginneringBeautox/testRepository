"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/Sidebar";
import LogoutIcon from "@/assets/icons/LogoutIcon";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  // Function to handle logout (asynchronous)
  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include", // Include cookies for session management
      });

      const data = await response.json();

      if (data.success) {
        // Clear localStorage items
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("loginTime");

        // Notify other tabs about the logout event
        localStorage.setItem("logout", Date.now());

        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error message to the user
    }
  };

  // Listen for logout events from other tabs and force a reload
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  // Check for 24-hour session expiry on mount
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - parseInt(loginTime, 10) > twentyFourHours) {
        // Automatically log out the user if session has expired
        handleLogout();
      }
    }
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="LOGOUT" onClick={handleLogout}>
          <LogoutIcon />
          <span className="flex flex-row gap-2 justify-center items-center">
            LOGOUT
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
