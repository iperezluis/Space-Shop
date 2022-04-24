import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import Product from "../../../models/Product";

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProducts(req, res);

    default:
      return res.status(404).json({
        message: "Bad Request: EndPoint not found",
      });
  }
}
async function searchProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  let { q = "" } = req.query;
  if (q.length === 0) {
    return res.status(404).json({
      message: "Debe espicificar el parámetro de busqueda",
    });
  }
  q = q.toString().toLowerCase();
  try {
    await db.connect();
    const products = await Product.find({
      $text: { $search: q },
    })
      .select("title images inStock price -_id")
      .lean();
    await db.disconnect();

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Bad request: hubo un error en el servidor",
    });
  }
}
