import { Router } from "express";
import Order, { type IOrder } from "../models/Order.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";
import { requireAuth } from "../middleware/auth.js";

export function orderPayload(o: IOrder & { _id: unknown }) {
  return {
    id: String(o._id),
    orderNumber: o.orderNumber,
    customer: o.customer,
    items: o.items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      image: i.image,
    })),
    subtotal: o.subtotal,
    shipping: o.shipping,
    tax: o.tax,
    total: o.total,
    status: o.status,
    trackingNumber: o.trackingNumber,
    payment: { status: o.payment.status, sessionId: o.payment.sessionId },
    createdAt: o.createdAt,
  };
}

export const ordersRouter = Router();

ordersRouter.get(
  "/session/:sessionId",
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ "payment.sessionId": req.params.sessionId });
    if (!order) {
      return res.json({ found: false, order: null });
    }
    res.json({ found: true, order: orderPayload(order) });
  }),
);

ordersRouter.use("/", requireAuth);

ordersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ "customer.userId": req.user!._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ orders: orders.map(orderPayload) });
  }),
);

ordersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new HttpError(404, "Order not found");
    const isOwner =
      order.customer.userId && String(order.customer.userId) === String(req.user!._id);
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new HttpError(403, "You do not have access to this order");
    }
    res.json({ order: orderPayload(order) });
  }),
);