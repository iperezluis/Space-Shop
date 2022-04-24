import type { NextApiRequest, NextApiResponse } from "next";
import { database, db } from "../../database";
import { initialData } from "../../database/seed-data";
import { Product, User } from "../../models";
import Order from "../../models/Order";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === "production") {
    res.status(401).json({
      message: "don't have access to this API, PERMISSION DENIED",
    });
  }
  try {
    await db.connect();
    //to fill database as test

    await Order.deleteMany();
    // const orders = await Order.insertMany(database.initialData.users);
    await User.deleteMany();
    const users = await User.insertMany(database.initialData.users);
    await Product.deleteMany();
    const product = await Product.insertMany(database.initialData.products);
    await db.disconnect();
    res.status(200).json({
      message: "request has been processed successfully",
      users,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error on the server",
    });
  }
}
