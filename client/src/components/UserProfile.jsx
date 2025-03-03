import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  // 1. Use `useLocation` to get the current path
  const location = useLocation();

  // 2. Define which routes should hide the icon
  const hideIconRoutes = ["/login"];

  // 3. Determine if the icon should be visible
  const isIconVisible = !hideIconRoutes.includes(location.pathname.toLowerCase());

  useEffect(() => {
    const updateUserData = () => {
      setUserName(localStorage.getItem("username") || "");
      setUserRole(localStorage.getItem("role") || "");
    };

    const handleStorageChange = () => {
      updateUserData();
    };

    const handleCustomEvent = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userProfileUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userProfileUpdated", handleCustomEvent);
    };
  }, []);

  return (
    <div className="flex items-center justify-end gap-2 p-3 rounded-lg bg-transparent w-full">
      <div className="text-right">
        <h6 className="text-base font-semibold">{userName.toUpperCase()}</h6>
        <p className="text-xs text-gray-600">{userRole?.toUpperCase()}</p>
      </div>
      {/* Conditionally render the UserIcon */}
      {isIconVisible && <UserIcon size={36} className="h-full" />}
    </div>
  );
};

export default UserProfile;
