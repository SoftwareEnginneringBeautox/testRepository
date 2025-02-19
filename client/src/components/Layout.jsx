import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import UserProfile from "./UserProfile";

export default function Layout({ children }) {
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
          <div className="flex flex-col flex-1 max-w-[90%] gap-4">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
