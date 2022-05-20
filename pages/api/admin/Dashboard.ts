import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product, Order, User } from "../../../models";

type Data =
  | {
      numberOfOrders: number;
      paidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productsWithNotInventory: number;
      lowInventory: number;
      notPaidOrders: number;
    }
  | { message: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getInventory(req, res);

    default:
      return res.status(400).json({
        message: "EndPoint No existe",
      });
  }
}

const getInventory = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  //first we should to block our Api in production
  // if (process.env.NODE_ENV === "production") {
  //   return res.status(401).json({
  //     message: "Access denied, you don't have permission to this endpoint",
  //   });
  // }
  //otra manera de resolverlo pero no muyy eficiente
  // await db.connect();
  // const numberOfOrders = await Order.count();
  // const isPaidOrders = await Order.find({ isPaid: true }).count();
  // const numberOfClients = await User.find({ role: "client" }).count();
  // const numberOfProducts = await Product.count();
  // const productsWithNotInventory = await Product.find({ inStock: 0 }).count();
  // // $lte= less than equal
  // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();
  // await db.disconnect();

  await db.connect();
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: "client" }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  //mi otra solucion con mayor rendimiento
  // const numberOfProducts = products.length;

  // const productsWithNotInventory = products.filter(
  //   (product) => product.inStock === 0
  // ).length;
  // const lowInventory = products.filter(
  //   (product) => product.inStock <= 10
  // ).length;

  // const numberOfClients = clients.filter(
  //   (client) => client.role !== "admin"
  // ).length;

  // const numberOfOrders = orders.length;

  // const paidOrders = orders.filter((order) => order.isPaid === true).length;

  // const notPaidOrders = orders.filter((order) => order.isPaid !== true).length;

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
    notPaidOrders: numberOfOrders - paidOrders,
  });
};
