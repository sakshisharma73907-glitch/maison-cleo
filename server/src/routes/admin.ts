import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order, { ORDER_STATUSES, type OrderStatus } from "../models/Order.js";
import { PRODUCT_CATEGORIES, toSlug } from "../models/Product.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";
import { requireAdmin } from "../middleware/auth.js";
import { productUpload, publicUrl } from "../lib/uploads.js";
import { publicProductPayload } from "./products.js";
import { orderPayload } from "./orders.js";

function adminProductPayload(p: {
  _id: unknown;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  hover?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  active: boolean;
  createdAt: Date;
}) {
  return {
    ...publicProductPayload(p),
    stock: p.stock,
    active: p.active,
    createdAt: p.createdAt,
  };
}

type ProductInput = {
  name?: string;
  price?: string | number;
  compareAtPrice?: string | number;
  description?: string;
  category?: string;
  image?: string;
  hover?: string;
  sizes?: string;
  colors?: string;
  stock?: string | number;
  isFeatured?: string | boolean;
  isNew?: string | boolean;
  isBestseller?: string | boolean;
  active?: string | boolean;
};

function parseBool(v: string | boolean | undefined): boolean {
  if (v === undefined) return false;
  if (typeof v === "boolean") return v;
  return v === "true" || v === "1" || v === "on";
}

function parseOptionalNum(v: string | number | undefined): number | undefined {
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toCsvList(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const adminRouter = Router();

adminRouter.use(requireAdmin);

/* ---------------- Dashboard metrics ---------------- */

adminRouter.get(
  "/metrics",
  asyncHandler(async (_req, res) => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      revenueAgg,
      monthAgg,
      ordersCount,
      usersCount,
      lowStock,
      recentOrders,
    ] = await Promise.all([
      Order.aggregate<{ total: number }>([
        { $match: { "payment.status": "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate<{ revenue: number; count: number }>([
        { $match: { "payment.status": "Paid", createdAt: { $gte: monthStart } } },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
      ]),
      Order.countDocuments({ "payment.status": "Paid" }),
      User.countDocuments({ role: "customer" }),
      Product.find({ active: true, stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .limit(8)
        .select("name slug stock isFeatured"),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      totalRevenue: revenueAgg[0]?.total ?? 0,
      ordersCount,
      monthlyRevenue: monthAgg[0]?.revenue ?? 0,
      monthlyOrders: monthAgg[0]?.count ?? 0,
      usersCount,
      lowStock: lowStock.map((p) => ({
        id: String(p._id),
        name: p.name,
        slug: p.slug,
        stock: p.stock,
        isFeatured: p.isFeatured,
      })),
      recentOrders: recentOrders.map(orderPayload),
    });
  }),
);

/* ---------------- Product management ---------------- */

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional(),
});

adminRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const q = listSchema.parse(req.query);
    const filter: Record<string, unknown> = {};
    if (q.q) {
      filter.$or = [
        { name: { $regex: q.q, $options: "i" } },
        { slug: { $regex: q.q, $options: "i" } },
      ];
    }
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((q.page - 1) * q.limit)
        .limit(q.limit),
    ]);
    res.json({
      products: products.map(adminProductPayload),
      total,
      page: q.page,
      limit: q.limit,
    });
  }),
);

function collectProductInput(body: ProductInput, files: {
  image?: Express.Multer.File[];
  hover?: Express.Multer.File[];
}): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.category !== undefined) data.category = body.category;

  const price = parseOptionalNum(body.price);
  if (price !== undefined) data.price = price;
  const compareAtPrice = parseOptionalNum(body.compareAtPrice);
  if (compareAtPrice !== undefined) data.compareAtPrice = compareAtPrice;
  const stock = parseOptionalNum(body.stock);
  if (stock !== undefined) data.stock = stock;

  const sizes = toCsvList(body.sizes as string | undefined);
  if (body.sizes !== undefined) data.sizes = sizes;
  const colors = toCsvList(body.colors as string | undefined);
  if (body.colors !== undefined) data.colors = colors;

  if (body.isFeatured !== undefined) data.isFeatured = parseBool(body.isFeatured);
  if (body.isNew !== undefined) data.isNew = parseBool(body.isNew);
  if (body.isBestseller !== undefined) data.isBestseller = parseBool(body.isBestseller);
  if (body.active !== undefined) data.active = parseBool(body.active);

  if (body.image !== undefined && body.image !== "") data.image = body.image;
  if (files.image?.[0]) data.image = publicUrl(files.image[0].filename);
  if (files.hover?.[0]) data.hover = publicUrl(files.hover[0].filename);
  if (body.hover !== undefined && body.hover !== "") data.hover = body.hover;

  return data;
}

function validateProductData(data: Record<string, unknown>, partial: boolean) {
  if (!partial || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string") {
      throw new HttpError(400, "Product name is required");
    }
  }
  if (!partial || data.category !== undefined) {
    const category = data.category as string;
    if (!PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
      throw new HttpError(
        400,
        `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`,
      );
    }
  }
  if (!partial || data.price !== undefined) {
    const price = Number(data.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new HttpError(400, "Valid price is required");
    }
  }
  if (!partial || data.image !== undefined) {
    if (!data.image || typeof data.image !== "string") {
      throw new HttpError(400, "A product image is required (upload or URL)");
    }
  }
  if (data.stock !== undefined && Number(data.stock) < 0) {
    throw new HttpError(400, "Stock cannot be negative");
  }
}

const productFields = productUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "hover", maxCount: 1 },
]);

adminRouter.post(
  "/products",
  productFields,
  asyncHandler(async (req, res) => {
    const files = (req.files ?? {}) as {
      image?: Express.Multer.File[];
      hover?: Express.Multer.File[];
    };
    const data = collectProductInput(req.body as ProductInput, files);
    validateProductData(data, false);

    const product = await Product.create({
      ...data,
      slug: toSlug(String(data.name)),
    });

    res.status(201).json({ product: adminProductPayload(product) });
  }),
);

adminRouter.put(
  "/products/:id",
  productFields,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new HttpError(400, "Invalid product id");
    }
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, "Product not found");

    const files = (req.files ?? {}) as {
      image?: Express.Multer.File[];
      hover?: Express.Multer.File[];
    };
    const data = collectProductInput(req.body as ProductInput, files);
    validateProductData(data, true);

    Object.assign(product, data);
    await product.save();

    res.json({ product: adminProductPayload(product) });
  }),
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new HttpError(400, "Invalid product id");
    }
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, "Product not found");

    product.active = false;
    await product.save();

    res.json({ ok: true, id: String(product._id) });
  }),
);

/* ---------------- Order management ---------------- */

const orderListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(ORDER_STATUSES).optional(),
});

adminRouter.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const q = orderListSchema.parse(req.query);
    const filter: Record<string, unknown> = {};
    if (q.status) filter.status = q.status;

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((q.page - 1) * q.limit)
        .limit(q.limit),
    ]);
    res.json({ orders: orders.map(orderPayload), total, page: q.page, limit: q.limit });
  }),
);

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  trackingNumber: z.string().max(80).optional(),
});

adminRouter.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new HttpError(400, "Invalid order id");
    }
    const parsed = statusSchema.parse(req.body ?? {});
    const order = await Order.findById(req.params.id);
    if (!order) throw new HttpError(404, "Order not found");

    order.status = parsed.status as OrderStatus;
    if (parsed.trackingNumber !== undefined) {
      order.set("trackingNumber", parsed.trackingNumber);
    }
    await order.save();

    res.json({ order: orderPayload(order) });
  }),
);