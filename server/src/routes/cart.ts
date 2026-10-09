import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Product from "../models/Product.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";
import { optionalAuth } from "../middleware/auth.js";
import {
  findOrCreateCart,
  findExistingCart,
  getCartToken,
  serializeCart,
} from "../lib/cartIdentity.js";

async function resolveProductByIdentifier(idOrSlug: string) {
  if (mongoose.isValidObjectId(idOrSlug)) {
    const byId = await Product.findById(idOrSlug);
    if (byId) return byId;
  }
  return Product.findOne({ slug: idOrSlug });
}

async function resolveProductIdOrNull(idOrSlug: string): Promise<string | null> {
  const product = await resolveProductByIdentifier(idOrSlug);
  return product ? String(product._id) : null;
}

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).optional(),
  size: z.string().max(20).optional(),
  color: z.string().max(40).optional(),
});

const updateSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
  size: z.string().max(20).optional(),
  color: z.string().max(40).optional(),
});

function sameVariant(a: { size?: string; color?: string }, b: { size?: string; color?: string }) {
  return (a.size ?? "") === (b.size ?? "") && (a.color ?? "") === (b.color ?? "");
}

/** Loose match for updates: omitted size/color act as wildcards. */
function variantWildcardMatch(a: { size?: string; color?: string }, b: { size?: string; color?: string }) {
  if (b.size !== undefined && (a.size ?? "") !== b.size) return false;
  if (b.color !== undefined && (a.color ?? "") !== b.color) return false;
  return true;
}

export const cartRouter = Router();

cartRouter.use(optionalAuth);

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { cart, isGuest } = await findExistingCart(req);
    if (!cart) return res.json({ items: [], count: 0, subtotal: 0 });
    const payload = await serializeCart(cart);
    if (isGuest) res.setHeader("x-cart-token", getCartToken(req) ?? "");
    res.json(payload);
  }),
);

cartRouter.post(
  "/add",
  asyncHandler(async (req, res) => {
    const parsed = addSchema.parse(req.body ?? {});
    const product = await resolveProductByIdentifier(parsed.productId);
    if (!product || !product.active) {
      throw new HttpError(404, "Product not found", {
        code: "PRODUCT_NOT_FOUND",
      });
    }

    const incomingQty = parsed.quantity ?? 1;
    const { cart, isGuest } = await findOrCreateCart(req, res);

    const existing = cart.items.find(
      (i) =>
        String(i.product) === String(product._id) &&
        sameVariant(i, parsed),
    );

    const newQty = (existing ? existing.quantity : 0) + incomingQty;
    if (newQty > product.stock) {
      throw new HttpError(400, `Only ${product.stock} in stock`, {
        code: "OUT_OF_STOCK",
      });
    }

    if (existing) existing.quantity = newQty;
    else {
      cart.items.push({
        product: product._id,
        quantity: incomingQty,
        size: parsed.size,
        color: parsed.color,
        priceAtAdd: product.price,
      });
    }

    await cart.save();
    const payload = await serializeCart(cart);
    if (isGuest) res.setHeader("x-cart-token", getCartToken(req) ?? "");
    res.json(payload);
  }),
);

cartRouter.put(
  "/update",
  asyncHandler(async (req, res) => {
    const parsed = updateSchema.parse(req.body ?? {});
    const { cart, isGuest } = await findOrCreateCart(req, res);
    const targetId = await resolveProductIdOrNull(parsed.productId);
    if (targetId === null) {
      throw new HttpError(404, "Item is not in your cart", {
        code: "NOT_IN_CART",
      });
    }

    const idx = cart.items.findIndex(
      (i) => String(i.product) === targetId && variantWildcardMatch(i, parsed),
    );
    if (idx === -1) {
      throw new HttpError(404, "Item is not in your cart", {
        code: "NOT_IN_CART",
      });
    }
    const item = cart.items[idx];

    if (parsed.quantity === 0) {
      cart.items.splice(idx, 1);
    } else {
      const product = await Product.findById(item.product);
      if (!product || !product.active) {
        throw new HttpError(404, "Product no longer available");
      }
      if (parsed.quantity > product.stock) {
        throw new HttpError(400, `Only ${product.stock} in stock`, {
          code: "OUT_OF_STOCK",
        });
      }
      item.quantity = parsed.quantity;
      if (parsed.size !== undefined) item.size = parsed.size;
      if (parsed.color !== undefined) item.color = parsed.color;
    }

    await cart.save();
    const payload = await serializeCart(cart);
    if (isGuest) res.setHeader("x-cart-token", getCartToken(req) ?? "");
    res.json(payload);
  }),
);

cartRouter.delete(
  "/remove/:productId",
  asyncHandler(async (req, res) => {
    const productId = String(req.params.productId);
    const { cart, isGuest } = await findExistingCart(req);
    if (!cart) return res.json({ items: [], count: 0, subtotal: 0 });

    const targetId = await resolveProductIdOrNull(productId);
    if (targetId) {
      const kept = cart.items.filter((i) => String(i.product) !== targetId);
      cart.items.splice(0, cart.items.length, ...kept);
      await cart.save();
    }
    const payload = await serializeCart(cart);
    if (isGuest) res.setHeader("x-cart-token", getCartToken(req) ?? "");
    res.json(payload);
  }),
);

cartRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { cart, isGuest } = await findExistingCart(req);
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    if (isGuest) res.setHeader("x-cart-token", getCartToken(req) ?? "");
    res.json({ items: [], count: 0, subtotal: 0 });
  }),
);