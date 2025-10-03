"use client";
import { createContext, useContext, useState } from "react";

type UserContextData = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};
export type UserData = {
  _id: string | null;
  token: string | null;
  username: string | null;
};

const defaultUserData: UserData = { _id: null, username: null, token: null };
const defaultValue: UserContextData = {
  setUserData: () => {},
  userData: defaultUserData,
};

const UserContext = createContext<UserContextData>(defaultValue);

export const UserContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const value: UserContextData = {
    userData,
    setUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserContextProvider.");
  return context;
};
