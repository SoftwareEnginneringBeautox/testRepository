import { useEffect, useState } from "react";
import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const updateUserData = () => {
      setUserName(localStorage.getItem("username") || "");
      setUserRole(localStorage.getItem("role") || "");
    };

    // Listen for changes in localStorage (cross-tab support)
    const handleStorageChange = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Listen for manual updates (same-tab support)
    const handleCustomEvent = () => {
      updateUserData();
    };
    
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
      <UserIcon size={36} className="h-full" />
    </div>
  );
};

export default UserProfile;
