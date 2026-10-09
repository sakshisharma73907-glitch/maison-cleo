import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";
import { stripeClient } from "../lib/stripe.js";
import { findExistingCart } from "../lib/cartIdentity.js";
import { computeTotals } from "../lib/pricing.js";
import { absoluteUrl } from "../lib/uploads.js";
import { checkoutLimiter } from "../lib/rateLimit.js";
import { optionalAuth } from "../middleware/auth.js";

const sessionSchema = z.object({
  email: z.string().email().optional(),
});

type PopulatedProduct = {
  _id: unknown;
  slug: string;
  name: string;
  price: number;
  image?: string;
  compareAtPrice?: number;
  stock: number;
  active?: boolean;
};

type CartLine = {
  product: PopulatedProduct;
  quantity: number;
  size?: string;
  color?: string;
};

export const checkoutRouter = Router();

checkoutRouter.use(optionalAuth);

checkoutRouter.post(
  "/sessions",
  checkoutLimiter,
  asyncHandler(async (req, res) => {
    if (!env.isStripeConfigured) {
      throw new HttpError(
        503,
        "Payments are not configured yet. Set STRIPE_SECRET_KEY and restart the server.",
        { code: "PAYMENTS_NOT_CONFIGURED" },
      );
    }

    const body = sessionSchema.parse(req.body ?? {});
    const { cart } = await findExistingCart(req);
    if (!cart || cart.items.length === 0) {
      throw new HttpError(400, "Your cart is empty", { code: "EMPTY_CART" });
    }

    await cart.populate({
      path: "items.product",
      model: "Product",
      select: "slug name price image compareAtPrice stock active",
    });

    const lines: CartLine[] = [];
    for (const it of cart.items) {
      const product = it.product as unknown as PopulatedProduct | null;
      if (!product || product.active === false) {
        throw new HttpError(
          400,
          "One of your items is no longer available. Please update your cart.",
          { code: "ITEM_UNAVAILABLE", details: { productId: String(it.product) } },
        );
      }
      lines.push({ product, quantity: it.quantity, size: it.size, color: it.color });
    }

    const stockByKey = new Map<string, number>();
    for (const l of lines) {
      stockByKey.set(
        String(l.product._id),
        (stockByKey.get(String(l.product._id)) ?? 0) + l.quantity,
      );
    }
    for (const [key, needed] of stockByKey) {
      const product = lines.find((l) => String(l.product._id) === key)!.product;
      if (needed > product.stock) {
        throw new HttpError(
          400,
          `Sorry — only ${product.stock} × ${product.name} left in stock. Please adjust your cart.`,
          { code: "OUT_OF_STOCK", details: { productId: String(product._id) } },
        );
      }
    }

    const totals = computeTotals(
      lines.map((l) => ({ price: l.product.price, quantity: l.quantity })),
    );
    const email = (req.user?.email ?? body.email)?.toLowerCase();
    if (!email) {
      throw new HttpError(400, "An email is required for checkout.", {
        code: "EMAIL_REQUIRED",
      });
    }

    const base = `${req.protocol}://${req.get("host")}`;
    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; images?: string[] };
        unit_amount: number;
      };
      quantity: number;
    }[] = lines.map((l) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: l.product.name,
          images: l.product.image
            ? [absoluteUrl(base, l.product.image)]
            : [],
        },
        unit_amount: Math.round(l.product.price * 100),
      },
      quantity: l.quantity,
    }));
    if (totals.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping (flat rate)" },
          unit_amount: Math.round(totals.shipping * 100),
        },
        quantity: 1,
      });
    }
    if (totals.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Sales tax (TN 8.25%)" },
          unit_amount: Math.round(totals.tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      metadata: {
        cartId: String(cart._id),
        userId: req.user ? String(req.user._id) : "",
      },
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
    });

    res.json({ sessionId: session.id, url: session.url, totals });
  }),
);