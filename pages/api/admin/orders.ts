import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res);

    default:
      return res.status(400).json({
        message: "End point no existe",
      });
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  //Nota: para que el populate no devuelva null al user se deben crear los usuarios desde el formulario para que se creee el new Schema y los datos como email name etc.. intertandolos directamente no surte efecto el populate
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: "desc" })
    .lean();
  await db.disconnect();

  return res.status(200).json(orders);
};
