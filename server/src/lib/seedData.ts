import { env } from "../config/env.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

type SeedProduct = {
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  description: string;
  image: string;
  hover: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
};

const products: SeedProduct[] = [
  {
    name: "Azalea Floral Midi Dress",
    price: 178,
    category: "Dresses & Skirts",
    description:
      "A floaty floral midi in washed linen-cotton. Relaxed through the body with a soft drawstring waist.",
    image: img("photo-1572804013309-59a88b7e92f1"),
    hover: img("photo-1496747611176-843222e1e57c"),
    sizes: ["XS", "S", "M", "L"],
    colors: ["Rosewater Print"],
    stock: 18,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
  },
  {
    name: "Coastal Midi Dress",
    price: 188,
    category: "Dresses & Skirts",
    description:
      "Our bestselling midi with a gentle tiered skirt and smocked back. Easy on, easier to live in.",
    image: img("photo-1496747611176-843222e1e57c"),
    hover: img("photo-1572804013309-59a88b7e92f1"),
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Oat", "Sage"],
    stock: 12,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
  },
  {
    name: "Cable-Knit Cardigan",
    price: 142,
    compareAtPrice: 185,
    category: "Tops & Blouses",
    description:
      "Cloud-weight alpaca blend with a chunky cable stitch. Fits oversized — size down for a neater line.",
    image: img("photo-1517841905240-472988babdf9"),
    hover: img("photo-1434389677669-e08b4cac3105"),
    sizes: ["S", "M", "L"],
    colors: ["Ivory"],
    stock: 14,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
  },
  {
    name: "The Silk Shell",
    price: 128,
    category: "Tops & Blouses",
    description:
      "A single-layer silk shell with a cowl neck. The quietest workhorse in your closet.",
    image: img("photo-1503342217505-b0a15ec3261c"),
    hover: img("photo-1607746882042-944635dfe10e"),
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne", "Ink"],
    stock: 22,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
  },
  {
    name: "Vintage Moto Jacket",
    price: 328,
    category: "Outerwear & Layers",
    description:
      "Grainy lambskin with the patina already started. One of only a handful we source each season.",
    image: img("photo-1487222477894-8943e31ef7b2"),
    hover: img("photo-1515372039744-b8f02a3ae446"),
    sizes: ["S", "M", "L"],
    colors: ["Dark Oak"],
    stock: 3,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
  },
  {
    name: "Ribbed Layering Tank",
    price: 96,
    category: "Tops & Blouses",
    description:
      "Fine-gauge rib that holds its shape wear after wear. Cut long enough to stay tucked.",
    image: img("photo-1558769132-cb1aea458c5e"),
    hover: img("photo-1489987707025-afc232f7ea0f"),
    sizes: ["XS", "S", "M", "L"],
    colors: ["Bone", "Espresso"],
    stock: 30,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
  },
  {
    name: "Clementine Leather Bag",
    price: 264,
    category: "Accessories",
    description:
      "Vegetable-tanned leather, brass hardware, and a top that cinches. Fits a day out and back again.",
    image: img("photo-1485968579580-b6d095142e6e"),
    hover: img("photo-1492707892479-7bc8d5a4ee93"),
    sizes: [],
    colors: ["Terracotta", "Black"],
    stock: 4,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
  },
  {
    name: "Cloud Knit Sweater",
    price: 142,
    category: "Tops & Blouses",
    description:
      "Airy loop-knit merino that feels like nothing and keeps you warm anyway.",
    image: img("photo-1529139574466-a303027c1d8b"),
    hover: img("photo-1517841905240-472988babdf9"),
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream", "Dusty Rose"],
    stock: 16,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
  },
  {
    name: "Checked Poplin Shirt",
    price: 118,
    category: "Tops & Blouses",
    description:
      "A crisp oversized poplin in a quiet gingham. Button it up or throw it over a tee.",
    image: img("photo-1607746882042-944635dfe10e"),
    hover: img("photo-1509631179647-0177331693ae"),
    sizes: ["S", "M", "L"],
    colors: ["Oat Check"],
    stock: 9,
    isFeatured: false,
    isNew: false,
    isBestseller: true,
  },
];

export async function seedDatabase(): Promise<{ products: number }> {
  console.log("[seed] clearing existing data…");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);

  console.log("[seed] creating admin + demo customer…");
  const admin = await User.create({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    firstName: "Cleo",
    lastName: "Admin",
    role: "admin",
  });

  const customer = await User.create({
    email: "customer@maisoncleo.com",
    password: "Customer2026!",
    firstName: "Demo",
    lastName: "Customer",
    role: "customer",
  });

  console.log("[seed] inserting products…");
  const inserted = await Product.insertMany(products);
  const byName = new Map(inserted.map((p) => [p.name, p]));

  const demoItems = [
    { name: "Cloud Knit Sweater", quantity: 1, color: "Cream" },
    { name: "Ribbed Layering Tank", quantity: 2, color: "Bone" },
  ];
  for (const it of demoItems) {
    const p = byName.get(it.name)!;
    await Cart.findOneAndUpdate(
      { userId: customer._id },
      {
        $push: {
          items: {
            product: p._id,
            quantity: it.quantity,
            color: it.color ?? undefined,
            priceAtAdd: p.price,
          },
        },
      },
      { upsert: true },
    );
  }

  console.log("───────── Seed complete ─────────");
  console.log(`Admin:    ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
  console.log(`Customer: customer@maisoncleo.com / Customer2026!`);
  console.log(`Products: ${inserted.length}`);
  console.log(`Admin account id: ${String(admin._id)}`);

  return { products: inserted.length };
}