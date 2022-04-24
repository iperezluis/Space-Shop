import { ISize } from "./products";
import { IUser } from "./user";

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: string;

  numberOfItems: number;
  subTotalPay: number;
  tax: number;
  total: number;

  isPaid: boolean;
  payAt?: string;
  transactionId?: string;
}

export interface IOrderItem {
  _id?: string;
  title: string;
  sizes: ISize;
  quantity: number;
  slug: string;
  image: string;
  price: number;
  gender: string;
}
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  country: string;
  city: string;
  zip: string;
  phone: string;
}
