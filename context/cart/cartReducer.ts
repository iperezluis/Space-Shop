import { IProductCart, OrderSummary, ShippingAddress } from "../../interfaces";
import { CartState } from "./CartProvider";

type CartAction =
  | { type: "LoadCart from cookies | storage"; payload: IProductCart[] }
  | { type: "Update product cart"; payload: IProductCart[] }
  | { type: "Change product cart"; payload: IProductCart }
  | { type: "Remove product cart"; payload: IProductCart }
  | { type: "Update amount cart"; payload: OrderSummary }
  | { type: "Load address user"; payload: ShippingAddress }
  | { type: "Update address user"; payload: ShippingAddress }
  | { type: "Order Completed"; payload: OrderSummary };

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case "LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "Update product cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "Change product cart":
      return {
        ...state,
        cart: state.cart.map((p) => {
          if (p._id !== action.payload._id) return p;
          if (p.sizes !== action.payload.sizes) return p;
          p.quantity = action.payload.quantity;
          return p;
        }),
      };
    case "Remove product cart":
      return {
        ...state,
        cart: state.cart.filter(
          (p) =>
            !(p._id === action.payload._id && p.sizes === action.payload.sizes)
        ),
        //de la otra manera
        // cart: state.cart.filter((p) => {
        //   if (
        //     p._id === action.payload._id &&
        //     p.sizes === action.payload.sizes
        //   ) {
        //     return false;
        //   }
        //   return true;
        // }),
      };
    case "Update amount cart":
      return {
        ...state,
        orderSummary: { ...action.payload },
      };
    case "Load address user":
    case "Update address user":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "Order Completed":
      return {
        ...state,
        cart: [],
        orderSummary: {
          ...action.payload,
          numberOfItems: 0,
          subTotalPay: 0,
          tax: 0,
          total: 0,
        },
      };

    default:
      return state;
  }
};
