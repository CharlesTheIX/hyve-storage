"use client";
import { useUserContext } from "@/contexts/userContext";

type Props = {
  permission_level: number;
  children: React.ReactNode;
};

const PermissionsWrapper: React.FC<Props> = (props: Props) => {
  const { children, permission_level } = props;
  const { userData } = useUserContext();
  if (!userData.permissions?.includes(permission_level)) return <></>;
  return <>{children}</>;
};

export default PermissionsWrapper;
