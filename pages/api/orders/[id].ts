import type { NextApiRequest, NextApiResponse } from "next";
import Order from "../../../models/Order";
import { IOrder } from "../../../interfaces/order";
import { db } from "../../../database";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getOrderById(req, res);
    default:
      return res.status(400).json({
        message: "Este EndPoint no existe",
      });
  }
}
const getOrderById = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { id = "" } = req.query;
  await db.connect();

  const order = await Order.findById(id).lean();
  if (!order) {
    return res.status(404).json({ message: "Este id no existe" });
  }
  await db.disconnect();

  res.status(200).json(order as any);
};
