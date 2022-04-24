import { FC, useReducer, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";
import spaceApi from "../../api/spaceApi";

import Cookie from "js-cookie";
import axios from "axios";
import { Loading } from "../../components/ui";
import { useRouter } from "next/router";

export interface AuthState {
  isLoggedIn: boolean;
  user: IUser | undefined;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  //authentication with next auth
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // console.log(data?.user);
      dispatch({ type: "Login-user", payload: data?.user as IUser });
    }
  }, [status, data]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async () => {
    const token = Cookie.get("token");
    if (!token) {
      dispatch({ type: "Logout-user" });
      return;
    }
    try {
      const { data } = await spaceApi.get("/user/validate-token", {});
      const { newtoken, user } = data;
      console.log({ usuario: user, nuevotoken: newtoken });
      Cookie.set("token", newtoken);
      dispatch({ type: "Login-user", payload: user });
    } catch (error) {
      return Cookie.remove("token");
    }
  };
  //scope for functions providers
  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data } = await spaceApi.post("/user/login", {
        email,
        password,
      });
      const { token, user } = data;
      Cookie.set("token", token);
      dispatch({ type: "Login-user", payload: user });
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: any;
  }> => {
    setIsLoading(true);
    try {
      const { data } = await spaceApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookie.set("token", token);
      dispatch({ type: "Register-user", payload: user });
      setIsLoading(false);
      return { hasError: false };
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message: "no se ha podido crear el usuario",
      };
      // return false;
    }
  };

  const logoutUser = () => {
    Cookie.remove("products");
    Cookie.remove("address");
    Cookie.remove("address2");
    Cookie.remove("city");
    Cookie.remove("country");
    Cookie.remove("firstName");
    Cookie.remove("lastName");
    Cookie.remove("phone");
    Cookie.remove("zip");
    //this sigout belong to NextAuth
    signOut();
    // router.reload();
    // Cookie.remove("token");
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ ...state, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
