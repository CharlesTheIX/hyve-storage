"use client";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextData = {
  userData: Partial<User>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
};

const defaultValue: UserContextData = {
  userData: {},
  setUserData: () => {},
};

const UserContext = createContext<UserContextData>(defaultValue);

export const UserContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [userData, setUserData] = useState<Partial<User>>({});
  const value: UserContextData = {
    userData,
    setUserData,
  };

  useEffect(() => {
    setUserData({ permissions: [9] });
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserContextProvider.");
  return context;
};
