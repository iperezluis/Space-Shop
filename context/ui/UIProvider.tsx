import { FC, useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UIState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
};

export const UIProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleMenu = () => {
    dispatch({ type: "toggle-menu" });
  };
  return (
    <UIContext.Provider value={{ ...state, toggleMenu }}>
      {children}
    </UIContext.Provider>
  );
};
