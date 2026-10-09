import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://127.0.0.1:27017/maison-cleo"),
  MONGODB_IN_MEMORY: z
    .string()
    .default("false")
    .transform((v) => v === "true" || v === "1"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  JWT_SECRET: z
    .string()
    .min(16)
    .default("dev-only-insecure-jwt-secret-change-me"),
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  ADMIN_EMAIL: z.string().email().default("admin@maisoncleo.com"),
  ADMIN_PASSWORD: z.string().min(8).default("MaisonCleo-2026!"),
  MAIL_HOST: z.string().default(""),
  MAIL_PORT: z.coerce.number().int().positive().default(587),
  MAIL_USER: z.string().default(""),
  MAIL_PASS: z.string().default(""),
  MAIL_FROM: z.string().default("Maison Cleo <no-reply@maisoncleo.com>"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("[env] Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const isProd = parsed.data.NODE_ENV === "production";

export const env = {
  ...parsed.data,
  isProd,
  isStripeConfigured: Boolean(parsed.data.STRIPE_SECRET_KEY),
};