import { Schema, model } from "mongoose";
import { Cart } from "./Cart";

export const CartModel = model<Cart>("Carts", new Schema<Cart>({
  products: {
    type: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, required: true },
        _id: false,
      },
    ],
    default: [],
  },
}));