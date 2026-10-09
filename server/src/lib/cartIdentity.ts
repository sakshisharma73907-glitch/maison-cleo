import crypto from "node:crypto";
import type { Request, Response } from "express";
import Cart, { type ICart } from "../models/Cart.js";
import Product from "../models/Product.js";
import type { HydratedDocument } from "mongoose";

export const CART_TOKEN_HEADER = "x-cart-token";

export function getCartToken(req: Request): string | null {
  const value = req.headers[CART_TOKEN_HEADER];
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function setCartTokenHeader(res: Response, token: string): void {
  res.setHeader(CART_TOKEN_HEADER, token);
}

export async function findOrCreateCart(
  req: Request,
  res: Response,
): Promise<{ cart: HydratedDocument<ICart>; isGuest: boolean }> {
  if (req.user) {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    return { cart, isGuest: false };
  }

  let token = getCartToken(req);
  if (!token) {
    token = crypto.randomBytes(24).toString("hex");
  }
  let cart = await Cart.findOne({ cartToken: token });
  if (!cart) {
    cart = await Cart.create({ cartToken: token, items: [] });
  }
  setCartTokenHeader(res, token);
  return { cart, isGuest: true };
}

export async function findExistingCart(
  req: Request,
): Promise<{ cart?: HydratedDocument<ICart>; isGuest: boolean }> {
  if (req.user) {
    const cart = await Cart.findOne({ userId: req.user._id });
    return { cart: cart ?? undefined, isGuest: false };
  }
  const token = getCartToken(req);
  if (!token) return { isGuest: true };
  const cart = await Cart.findOne({ cartToken: token });
  return { cart: cart ?? undefined, isGuest: true };
}

export type SerializedCartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  lineTotal: number;
};

export type SerializedCart = {
  items: SerializedCartItem[];
  count: number;
  subtotal: number;
};

export async function serializeCart(
  cart: HydratedDocument<ICart>,
): Promise<SerializedCart> {
  if (cart.items.length > 0) {
    await cart.populate({
      path: "items.product",
      model: Product,
      select: "slug name price image hover compareAtPrice active",
    });
  }

  const items: SerializedCartItem[] = cart.items
    .map((it) => {
      const product = it.product as unknown as
        | { slug?: string; name?: string; price?: number; image?: string }
        | null;
      const price = product?.price ?? it.priceAtAdd;
      return {
        productId: product?.slug ?? String(it.product),
        name: product?.name ?? "Unavailable product",
        price,
        image: product?.image ?? "",
        quantity: it.quantity,
        size: it.size ?? undefined,
        color: it.color ?? undefined,
        lineTotal: price * it.quantity,
      };
    })
    .filter((it) => it.productId !== "Unavailable product");

  return {
    items,
    count: items.reduce((acc, it) => acc + it.quantity, 0),
    subtotal: items.reduce((acc, it) => acc + it.lineTotal, 0),
  };
}

export async function mergeGuestCart(
  userId: string,
  token: string | null,
): Promise<void> {
  if (!token) return;
  const guest = await Cart.findOne({ cartToken: token });
  if (!guest) return;
  if (guest.items.length === 0) {
    await Cart.deleteOne({ _id: guest._id });
    return;
  }

  let userCart = await Cart.findOne({ userId });
  if (!userCart) {
    userCart = await Cart.create({ userId, items: [] });
  }

  for (const g of guest.items) {
    const existing = userCart.items.find(
      (i) => String(i.product) === String(g.product) && i.size === g.size &&
        i.color === g.color,
    );
    if (existing) existing.quantity += g.quantity;
    else {
      userCart.items.push({
        product: g.product,
        quantity: g.quantity,
        size: g.size,
        color: g.color,
        priceAtAdd: g.priceAtAdd,
      });
    }
  }

  await userCart.save();
  await Cart.deleteOne({ _id: guest._id });
}