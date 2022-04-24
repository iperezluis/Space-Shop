import React, { createContext } from "react";
import { IUser } from "../../interfaces";

interface ContextProps {
  isLoggedIn: boolean;
  user: IUser | undefined;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ hasError: boolean; message?: any }>;
  logoutUser: () => void;
}

export const AuthContext = createContext({} as ContextProps);
