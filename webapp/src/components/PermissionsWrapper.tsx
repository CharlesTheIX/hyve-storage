"use client";
import { useUserContext } from "@/contexts/userContext";

type Props = {
  permissions: number[];
  children: React.ReactNode;
};

const PermissionsWrapper: React.FC<Props> = (props: Props) => {
  const { children, permissions } = props;
  const { userData } = useUserContext();
  if (!userData.permissions?.some((i) => permissions.includes(i))) return <></>;
  return <>{children}</>;
};

export default PermissionsWrapper;
