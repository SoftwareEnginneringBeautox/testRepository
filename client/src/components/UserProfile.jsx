import { useEffect, useState } from "react";
import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  const [userName, setUserName] = useState(
    () => localStorage.getItem("username") || ""
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("role") || ""
  );

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
