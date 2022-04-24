import { AuthState } from "./AuthProvider";
import { IUser } from "../../interfaces/user";

type AuthAction =
  | { type: "Login-user"; payload: IUser }
  | { type: "Register-user"; payload: IUser }
  | { type: "Logout-user" };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "Login-user":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case "Register-user":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case "Logout-user":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };

    default:
      return state;
  }
};
