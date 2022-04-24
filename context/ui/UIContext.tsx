import React, { createContext } from "react";

interface ContextProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const UIContext = createContext({} as ContextProps);
