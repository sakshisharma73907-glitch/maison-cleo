import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { HttpError } from "./HttpError.js";

const UPLOADS_DIR = path.resolve(import.meta.dirname, "../../uploads");
mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]+/gi, "-")
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export const productUpload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 2 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES.has(file.mimetype)) return cb(null, true);
    cb(
      new HttpError(
        400,
        "Only image files are allowed (jpeg, png, webp, gif, avif)",
      ),
    );
  },
});

export function uploadsDir(): string {
  return UPLOADS_DIR;
}

export function publicUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function absoluteUrl(base: string, value: string): string {
  if (value.startsWith("/uploads/")) return `${base}${value}`;
  return value;
}