"use client";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const location = useLocation();
  
  // Define routes that should hide the user icon
  const hideIconRoutes = ["/login"];
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
    // The relative positioning ensures that if you need to overlay or align elements,
    // the UserProfile will serve as the reference. The higher z-index (z-50) places it above the trigger.
    <div className="relative flex items-center justify-end gap-2 p-3 rounded-lg bg-transparent w-full z-50">
      <div className="text-right">
        <h6 className="text-base font-semibold">{userName.toUpperCase()}</h6>
        <p className="text-xs text-gray-600">{userRole?.toUpperCase()}</p>
      </div>
      {isIconVisible && <UserIcon size={36} className="h-full" />}
    </div>
  );
};

export default UserProfile;
