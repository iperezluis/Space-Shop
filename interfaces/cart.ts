import { ISize } from "./";

export interface IProductCart {
  _id: string;
  image: string;
  price: number; //este precio es para fines visuales pero este no va  allegar al backend, el precio se va a cobrar desde el backend no desde el front
  sizes?: ISize;
  slug: string;
  title: string;
  gender: "men" | "women" | "kid" | "unisex";
  quantity: number;
}
export type OrderSummary = {
  numberOfItems: number;
  subTotalPay: number;
  tax: number;
  total: number;
};
