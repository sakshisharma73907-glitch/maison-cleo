import mongoose from "mongoose";

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

export const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Refunded",
  "Failed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface IOrderItem {
  product?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface IOrder {
  orderNumber: string;
  customer: {
    userId?: mongoose.Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  payment: {
    provider: string;
    sessionId?: string;
    paymentIntentId?: string;
    status: PaymentStatus;
    paidAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `MC-${stamp}${rand}`;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      email: { type: String, required: true, lowercase: true, trim: true },
      firstName: { type: String },
      lastName: { type: String },
    },
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
    trackingNumber: { type: String },
    payment: {
      provider: { type: String, default: "stripe" },
      sessionId: { type: String, unique: true, sparse: true },
      paymentIntentId: { type: String },
      status: {
        type: String,
        enum: PAYMENT_STATUSES,
        default: "Pending",
      },
      paidAt: { type: Date },
    },
  },
  { timestamps: true },
);

orderSchema.index({ "payment.status": 1, createdAt: -1 });
orderSchema.index({ "customer.userId": 1, createdAt: -1 });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;