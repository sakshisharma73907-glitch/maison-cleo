import { Router } from "express";
import type Stripe from "stripe";
import { env } from "../config/env.js";
import Cart from "../models/Cart.js";
import Order, { generateOrderNumber } from "../models/Order.js";
import Product from "../models/Product.js";
import { stripeClient } from "../lib/stripe.js";
import { computeTotals } from "../lib/pricing.js";
import { sendOrderConfirmation } from "../lib/mailer.js";

export const webhooksRouter = Router();

webhooksRouter.post(
  "/webhook",
  async (req, res) => {
    const signature = req.headers["stripe-signature"] as string | string[] | undefined;
    const sig = Array.isArray(signature) ? signature[0] : signature;
    if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
      return res
        .status(400)
        .json({ error: "Missing signature or webhook secret" });
    }

    let event: Stripe.Event;
    try {
      event = stripeClient().webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      return res.status(400).json({ error: `Webhook error: ${message}` });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case "checkout.session.expired":
          console.log("[webhook] checkout session expired (ignored)");
          break;
        default:
          console.log(`[webhook] unhandled event type ${event.type}`);
      }
    } catch (err) {
      // Returning 5xx makes Stripe retry the event until it succeeds.
      console.error("[webhook] handler failed", err);
      return res.status(500).json({ error: "Webhook handler failed" });
    }

    res.json({ received: true });
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const existing = await Order.findOne({ "payment.sessionId": session.id });
  if (existing) {
    console.log(`[webhook] order for session ${session.id} already exists — skipping`);
    return;
  }

  const cartId = session.metadata?.cartId;
  const userId = session.metadata?.userId || undefined;
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const cart = cartId ? await Cart.findById(cartId) : null;

  if (!cart) {
    console.warn(`[webhook] cart ${cartId} not found for session ${session.id}`);
    return;
  }

  await cart.populate({
    path: "items.product",
    model: "Product",
    select: "slug name price image compareAtPrice stock",
  });

  type PopulatedProduct = {
    _id: unknown;
    name: string;
    price: number;
    image?: string;
    stock: number;
  };

  const items: {
    product?: unknown;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }[] = [];

  for (const it of cart.items) {
    const product = it.product as unknown as PopulatedProduct | null;
    const price = product?.price ?? it.priceAtAdd;
    const available = product?.stock ?? 0;
    const quantity = Math.min(it.quantity, available);
    items.push({
      product: product?._id,
      name: product?.name ?? "Unavailable product",
      price,
      quantity: Math.max(quantity, 1),
      size: it.size,
      color: it.color,
      image: product?.image ?? "",
    });
  }

  const totals = computeTotals(items);

  // Deduct inventory atomically; never oversell.
  for (const it of items) {
    if (!it.product) continue;
    await Product.updateOne(
      { _id: it.product, stock: { $gte: it.quantity } },
      { $inc: { stock: -it.quantity } },
    );
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: {
      userId: userId ? userId : undefined,
      email: email.toLowerCase(),
    },
    items,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    status: "Pending",
    payment: {
      provider: "stripe",
      sessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      status: "Paid",
      paidAt: new Date(),
    },
  });

  await Cart.deleteOne({ _id: cart._id });

  sendOrderConfirmation({
    orderNumber: order.orderNumber,
    email: order.customer.email,
    items: order.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: order.total,
  }).catch((err) => console.error("[mail] confirmation failed", err));

  console.log(
    `[webhook] order ${order.orderNumber} paid ($${order.total.toFixed(2)}) for ${order.customer.email}`,
  );
}