import { UIState } from "./UIProvider";

type UIAction = { type: "toggle-menu" } | { type: "close-menu" };

export const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "toggle-menu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };

    default:
      return state;
  }
};
