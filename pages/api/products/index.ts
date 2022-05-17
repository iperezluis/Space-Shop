import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { SHOP_CONSTANTS } from "../../../database/constantes";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = { message: string } | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    default:
      return res.status(400).json({
        message: "Endpoint not exist",
      });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = "all" } = req.query;
  let condition = {};
  //to valid searchs filters
  if (gender !== "all" && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender: gender };
  }

  try {
    await db.connect();
    const products = await Product.find(condition)
      .select("title images price slug inStock -_id")
      .lean();
    await db.disconnect();
    //Este ajuste es para que cargue bien las del server y las de cloudinary
    products.forEach(
      (product) =>
        (product.images = product.images.map((image) => {
          return image.includes("http")
            ? image
            : `${process.env.HOST_NAME}/products/${image}`;
        }))
    );
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Bad rquest: error on the server",
    });
  }
};
