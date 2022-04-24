import { FC, useEffect, useReducer, useState } from "react";
import { IProductCart, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";

import Cookie from "js-cookie";
import { OrderSummary } from "../../interfaces/cart";
import spaceApi from "../../api/spaceApi";
import { IOrder } from "../../interfaces/order";
import axios from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: IProductCart[];
  orderSummary: OrderSummary;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  orderSummary: {
    numberOfItems: 0,
    subTotalPay: 0,
    tax: 0,
    total: 0,
  },
  shippingAddress: undefined,
};

export const CartProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    if (Cookie.get("firstName")) {
      const shippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        country: Cookie.get("country") || "",
        city: Cookie.get("city") || "",
        zip: Cookie.get("zip") || "",
        phone: Cookie.get("phone") || "",
      };
      dispatch({ type: "Load address user", payload: shippingAddress });
    }
  }, []);

  useEffect(() => {
    // if the cookies were altered we return a catch
    try {
      const productInCookie = Cookie.get("products")
        ? JSON.parse(Cookie.get("products")!)
        : [];
      dispatch({
        type: "LoadCart from cookies | storage",
        payload: [...productInCookie],
      });
      console.log("cookies: ", productInCookie);
    } catch (error) {
      dispatch({
        type: "LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);
  // we storage in cookies
  useEffect(() => {
    Cookie.set("products", JSON.stringify(state.cart));
  }, [state.cart]);
  //we calculate this sub-total amount
  useEffect(() => {
    //the value current will start in 0 as initial Value, after this value is accumulate with prev value in each element in the array
    const numberOfItems = state.cart.reduce(
      (prev, current) => prev + current.quantity,
      0
    );
    const subTotalPay = state.cart.reduce(
      (prev, current) => prev + current.price * current.quantity,
      0
    );
    //guardamos el valor del impuesto por si cambia en un futuro y lo manejamos mejor cambiando la variable de entorno
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const tax = subTotalPay * taxRate;
    const orderSummary = {
      numberOfItems,
      subTotalPay,
      tax,
      total: tax + subTotalPay,
    };
    dispatch({ type: "Update amount cart", payload: { ...orderSummary } });
  }, [state.cart]);

  const addProductToCart = (product: IProductCart) => {
    //ultima solucion definitiva
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "Update product cart",
        payload: [...state.cart, product],
      });

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.sizes === product.sizes
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: "Update product cart",
        payload: [...state.cart, product],
      });
    //despues de pasar  topdas las validaciones
    const updateProduct = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.sizes !== product.sizes) return p;
      //con el map podemos mutar los leementos
      p.quantity += product.quantity;
      return p;
    });
    dispatch({ type: "Update product cart", payload: [...updateProduct] });
  };
  const updateProductInCart = (product: IProductCart) => {
    return dispatch({ type: "Change product cart", payload: product });
  };
  const removeProductInCart = (product: IProductCart) => {
    dispatch({
      type: "Remove product cart",
      payload: product,
    });
  };

  const updateShippingAddres = (address: ShippingAddress) => {
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("city", address.city);
    Cookie.set("country", address.country);
    Cookie.set("firstName", address.firstName);
    Cookie.set("lastName", address.lastName);
    Cookie.set("phone", address.phone);
    Cookie.set("zip", address.zip);

    dispatch({ type: "Update address user", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No existe direccion de entrega");
    }
    const body: IOrder = {
      orderItems: state.cart.map((p) => ({ ...p, sizes: p.sizes! })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.orderSummary.numberOfItems,
      subTotalPay: state.orderSummary.subTotalPay,
      tax: state.orderSummary.tax,
      total: state.orderSummary.total,
      isPaid: false,
    };
    try {
      const { data } = await spaceApi.post<IOrder>("/orders", body);
      dispatch({ type: "Order Completed", payload: state.orderSummary });
      console.log({ data });
      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado, hbale con el administrador",
      };
    }
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductInCart,
        removeProductInCart,
        updateShippingAddres,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
