import React, { createContext } from "react";
import { ShippingAddress } from "../../interfaces";
import { IProductCart, OrderSummary } from "../../interfaces/cart";

interface ContextProps {
  isLoaded: boolean;
  cart: IProductCart[];
  orderSummary: OrderSummary;
  shippingAddress?: ShippingAddress;
  addProductToCart: (product: IProductCart) => void;
  updateProductInCart: (products: IProductCart) => void;
  removeProductInCart: (product: IProductCart) => void;
  updateShippingAddres: (address: ShippingAddress) => void;
  createOrder: () => Promise<{
    hasError: boolean;
    message: string;
  }>;
}
export const CartContext = createContext({} as ContextProps);
