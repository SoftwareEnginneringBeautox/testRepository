import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import UserProfile from "./UserProfile";

export default function Layout({ children }) {
  // const location = useLocation();

  // // Routes that do not require a sidebar
  // const noSidebarRoutes = ["/login", "/signup", "/404"]; // example path only
  // const hasSidebar = !noSidebarRoutes.includes(location.pathname);

  // if (!hasSidebar) {
  //   return <main>{children}</main>;
  // }

  return (
    // <main>{children}</main>
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-width-mobile": "18rem"
      }}
    >
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="flex flex-col items-center ">
          <div className="flex flex-row justify-end w-full">
            <UserProfile />
          </div>
          <div className="flex flex-col text-left w-[90%] gap-4">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
