"use client";

import Image from "next/image";
import { useUserContext } from "@/contexts/userContext";

const AdminHeaderOptions: React.FC = () => {
  const { userData } = useUserContext();
  if (!userData._id) return <></>;

  return (
    <div className="admin-header-options">
      <p>Welcome{userData.username ? ` ${userData.username}` : ""}</p>

      <div className="profile-icon">
        <Image src="" width={20} height={20} alt="profile icon" />
      </div>
    </div>
  );
};

export default AdminHeaderOptions;
