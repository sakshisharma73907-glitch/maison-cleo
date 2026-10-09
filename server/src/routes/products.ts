import { Router } from "express";
import { z } from "zod";
import Product from "../models/Product.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";

function tagFor(p: { isNew: boolean; isBestseller: boolean }) {
  if (p.isNew) return "New";
  if (p.isBestseller) return "Bestseller";
  return "Collection";
}

export function publicProductPayload(p: {
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
}) {
  return {
    id: String(p._id),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    category: p.category,
    image: p.image,
    hover: p.hover,
    sizes: p.sizes,
    colors: p.colors,
    inStock: p.stock > 0,
    tag: tagFor(p),
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
  };
}

const listQuery = z.object({
  limit: z.coerce.number().int().min(1).max(60).default(24),
  skip: z.coerce.number().int().min(0).default(0),
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

const listPredicate = z
  .object({
    isFeatured: z.coerce.boolean().optional(),
    isNew: z.coerce.boolean().optional(),
    isBestseller: z.coerce.boolean().optional(),
  })
  .optional();

export const productsRouter = Router();

productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = listQuery.parse(req.query);
    const flags = listPredicate.parse(req.query) ?? {};

    const filter: Record<string, unknown> = { active: true };
    if (q.q) {
      filter.$or = [
        { name: { $regex: q.q, $options: "i" } },
        { description: { $regex: q.q, $options: "i" } },
      ];
    }
    if (q.category) filter.category = q.category;
    if (q.tag === "featured") filter.isFeatured = true;
    if (q.tag === "new") filter.isNew = true;
    if (q.tag === "bestseller") filter.isBestseller = true;
    if (flags.isFeatured !== undefined) filter.isFeatured = flags.isFeatured;
    if (flags.isNew !== undefined) filter.isNew = flags.isNew;
    if (flags.isBestseller !== undefined) filter.isBestseller = flags.isBestseller;

    const [total, docs] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(q.skip)
        .limit(q.limit),
    ]);

    res.json({
      products: docs.map(publicProductPayload),
      total,
      limit: q.limit,
      skip: q.skip,
    });
  }),
);

productsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({
      slug: req.params.slug,
      active: true,
    });
    if (!product) throw new HttpError(404, "Product not found");
    res.json({ product: publicProductPayload(product) });
  }),
);