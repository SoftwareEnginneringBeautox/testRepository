"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/Sidebar";
import LogoutIcon from "@/assets/icons/LogoutIcon";
import ForgotPassword from "@/components/modals/ForgotPassword";
import LightIcon from "@/assets/icons/LightIcon";
import DarkIcon from "@/assets/icons/DarkIcon";
import { useTheme } from "@/components/ThemeProvider";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { currentModal, openModal, closeModal } = useSidebar();
  const { theme, setTheme } = useTheme();

  const currentDocumentTheme = document.documentElement.classList.contains(
    "dark"
  )
    ? "dark"
    : "light";
  const effectiveTheme = theme === "system" ? currentDocumentTheme : theme;

  const toggleTheme = () => {
    const currentDocTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newTheme = theme === "light" ? "dark" : "light";

    console.log("🔄 Theme Toggle:");
    console.log("- Current theme state:", theme);
    console.log("- Current document class:", currentDocTheme);
    console.log("- Setting new theme to:", newTheme);

    setTheme(newTheme);

    // Force immediate update
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    console.log(
      "- Document class after toggle:",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  };

  const handleLogout = async () => {
    try {
      // Using backticks ensures that API_BASE_URL is interpolated correctly.
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include" // Include cookies for session management
      });

      // For debugging: log the raw response text if needed.
      const rawText = await response.text();
      console.log("Raw logout response:", rawText);

      // Try parsing the response as JSON.
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error("Failed to parse JSON from logout response");
      }

      if (data.success) {
        // Clear localStorage items
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("loginTime");
        localStorage.setItem("logout", Date.now());

        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
        setErrorMessage(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  // Listen for logout events from other tabs and force a reload.
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  // Check for 24-hour session expiry on mount.
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - parseInt(loginTime, 10) > twentyFourHours) {
        handleLogout();
      }
    }
  }, []);

  // Update theme state to match what's actually on the document
  useEffect(() => {
    const currentDocTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    if (theme !== currentDocTheme) {
      setTheme(currentDocTheme);
    }
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="TOGGLE THEME" onClick={toggleTheme}>
          {effectiveTheme === "light" ? <LightIcon /> : <DarkIcon />}
          <span className="flex gap-2 items-center">
            {effectiveTheme.toUpperCase()}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="LOGOUT" onClick={handleLogout}>
          <LogoutIcon />
          <span className="flex flex-row gap-2 justify-center items-center">
            LOGOUT
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {currentModal === "forgotPassword" && (
        <ForgotPassword isOpen={true} onClose={closeModal} />
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
      )}
    </SidebarMenu>
  );
}
