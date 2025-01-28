import UserIcon from "@/assets/icons/UserIcon";

const UserProfile = () => {
  return (
    <div className="flex flex-row items-center mt-5 mr-4">
      <div className="text-right mr-2">
        <h6 className="text-base font-semibold">JUAN HERNANDO</h6>
        <p className="text-[0.75rem] leading-5">AESTHETICIAN</p>
      </div>
      <UserIcon size={36} className="h-full" />
    </div>
  );
};

export default UserProfile;
