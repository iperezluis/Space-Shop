import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getAllProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return addProduct(req, res);

    default:
      res.status(400).json({
        message: "End point no existe",
      });
  }
}
const getAllProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" });
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
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({
      message: "Isn't an Valid Mongo id",
    });
  }

  if (images.length < 2) {
    return res.status(400).json({
      message: "The image should have at least two images",
    });
  }
  //TO DO: maybe we going to get a localhost:3000/products7sdsds.jpg

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({
        message: "No existe un producto con ese id",
      });
    }
    //Now we should delete before images in cloudinary when we updates
    //https://res.cloudinary.com/servidor-depruebas-backend/image/upload/v1643157168/axnvudg2pgijdge0fihn.jpg
    product.images.forEach(async (img) => {
      //if the selected images by user doesn't exist at product images then we should remove it of cloudinary
      if (!images.includes(img)) {
        const fileId = img.substring(img.lastIndexOf("/") + 1).split(".")[0];
        console.log(fileId);
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);
    // await product.save();
    await db.disconnect();

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({
      message: "Hubo un error en el servidor",
    });
  }
};

const addProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({
      message: " El producto debe contener al menos dos imagenes",
    });
  }
  //TO DO localhost: sjkfs
  try {
    await db.connect();
    const productInDb = await Product.findOne({ slug: req.body.slug }).lean();
    //validate if slug exist in our database
    if (productInDb) {
      await db.disconnect();
      return res.status(400).json({
        message: "Ya existe un producto con ese slug",
      });
    }
    const product = new Product(req.body);
    await product.save();
    await db.disconnect();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    res.status(400).json({
      message: "Revise los logs del servidor",
    });
  }
};
