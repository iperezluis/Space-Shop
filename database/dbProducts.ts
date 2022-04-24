import { db } from "./";
import Product from "../models/Product";
import { IProduct } from "../interfaces/products";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) {
    return null;
  }
  return JSON.parse(JSON.stringify(product));
};

export interface ProductSlug {
  slug: string;
}
//nota: si pones el try catch le estas diciendo que podria fallar y te obligara a que retornes un undefined tambien y no te sirve para getStaticPath
export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select("slug -_id").lean();
  await db.disconnect();

  return slugs;
};

export const getProductsByQuery = async (
  query: string
): Promise<IProduct[]> => {
  query = query.toString().toLowerCase();

  await db.connect();
  const products = await Product.find({
    $text: { $search: query },
  })
    .select("title images slug inStock price -_id")
    .lean();
  await db.disconnect();

  return products;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find()
    .select("title inStock slug images price -_id")
    .lean();
  await db.disconnect();

  return products;
};
