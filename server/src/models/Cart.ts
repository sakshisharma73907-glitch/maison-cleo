import mongoose from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  priceAtAdd: number;
}

export interface ICart {
  userId?: mongoose.Types.ObjectId;
  cartToken?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      sparse: true,
      unique: true,
    },
    cartToken: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        size: { type: String },
        color: { type: String },
        priceAtAdd: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;