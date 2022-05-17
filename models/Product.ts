import mongoose, { Schema, model, Model } from "mongoose";
import { IProduct } from "../interfaces";

const productSchema = new Schema(
  {
    description: { type: String, required: true, default: "" },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          message: `{VALUE} no es un tamaño valido`,
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true, default: "" },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["shirts", "pants", "hoodies", "hats"],
        message: `{VALUE} no es un tipo valido`,
      },
      default: "shirts",
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["men", "women", "kid", "unisex"],
        message: `{VALUE} no es un genero valido`,
      },
      default: "men",
    },
  },
  {
    timestamps: true,
  }
);

//creamos el index y usaremos el title y los tags como referencias para la bsuqueda
productSchema.index({ title: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || model("Product", productSchema);

export default Product;
