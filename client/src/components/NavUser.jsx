"use client";
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
        
        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // You might want to show an error message to the user
    }
  };

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