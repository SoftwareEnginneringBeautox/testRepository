"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/Sidebar";
// Removed LogoutIcon import

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

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
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="LOGOUT" onClick={handleLogout}>
          {/* Removed <LogoutIcon /> */}
          <span className="flex flex-row gap-2 justify-center items-center">
            LOGOUT
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
