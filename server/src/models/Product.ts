import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
  "Tops & Blouses",
  "Dresses & Skirts",
  "Outerwear & Layers",
  "Accessories",
] as const;

export interface IProduct {
  name: string;
  slug: string;
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
  updatedAt: Date;
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    hover: { type: String },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 20, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

productSchema.pre("validate", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = toSlug(this.name);
  }
  next();
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;