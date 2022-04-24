import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handlers(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);

    default:
      return res.status(404).json({
        message: "EndPoint not exist",
      });
  }
}

const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query;
  try {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Bad Request: Error on the server",
    });
  }
};
