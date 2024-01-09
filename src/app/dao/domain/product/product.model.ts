import { PaginateModel, Schema, model } from "mongoose";
import { Product } from "./Product";
import paginate from "mongoose-paginate-v2";

export const ProductModel = model<Product, PaginateModel<Product>>("Products", new Schema<Product>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, default: "No image" },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  status: { type: Boolean, default: true },
}).plugin(paginate));