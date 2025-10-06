"use client";
import { useUserContext } from "@/contexts/userContext";

type Props = {
  permissionLevel: number;
  children: React.ReactNode;
};

const PermissionsWrapper: React.FC<Props> = (props: Props) => {
  const { children, permissionLevel } = props;
  const { userData } = useUserContext();
  if (!userData.permissions?.includes(permissionLevel)) return <></>;
  return <>{children}</>;
};

export default PermissionsWrapper;
