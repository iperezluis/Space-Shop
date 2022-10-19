import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import Order from "../../../models/Order";
import { IOrder } from "../../../interfaces/order";
import { getSession } from "next-auth/react";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res);

    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({
        message: "No existe este EndPoint",
      });
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const orders = await Order.find();
  await db.disconnect();
  res.status(200).json(orders as any);
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //first we verify if the user is athenticated
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({
      message: "permission denied, you should be authenticated for this action",
    });
  }
  const { total, orderItems } = req.body as IOrder;
  await db.connect();
  //we checking on database all the ids from array orderItem that coming from frontend and return a array
  //$in singinifica que va buscar dentro de ese arreglo todos los id a ver si existen y nos va devolver todos los ids e informacion  de ese arreglo
  const productIds = orderItems.map((p) => p._id);
  const dbProducts = await Product.find({ _id: { $in: productIds } });
  //we check if the price products does matching
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((p) => p.id === current._id)?.price;
      if (!currentPrice) {
        throw new Error(
          "Sorry, please verify the cart, these products weren't found"
        );
      }

      return current.quantity * current.price + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * taxRate + subTotal;

    if (total !== backendTotal) {
      throw new Error(" El total no cuadra con el monto final");
    }
    //after all validations
    const userId = session.user._id;
    //nos aseguramos de poner isPaid en false por si lo intentan cambiar en true
    const order = new Order({ ...req.body, isPaid: false, user: userId });
    //we should to round to two decimals because this is required by payments managers such as paypal, stripe, mercadopago etc
    order.total = Math.round(order.total * 100) / 100;
    await order.save();
    await db.disconnect();

    res.status(201).json(order);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || "revise logs del servidor",
    });
  }
};
