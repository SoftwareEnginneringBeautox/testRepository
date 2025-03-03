import { useEffect, useState } from "react";
import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    setUserName(storedUsername || "");
    setUserRole(storedRole || "");
  }, []);

  return (
    <div className="flex items-center justify-end gap-2 p-3 rounded-lg bg-white shadow-md w-full">
      <div className="text-right">
        <h6 className="text-base font-semibold">{userName}</h6>
        <p className="text-xs text-gray-600">{userRole?.toUpperCase()}</p>
      </div>
      <UserIcon size={36} className="h-full" />
    </div>
  );
};

export default UserProfile;
