import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

const build = (limit: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please try again shortly.",
    },
    skip: () => env.NODE_ENV === "test",
  });

/** Auth endpoints: slow down brute-force attempts. */
export const authLimiter = build(20);
/** Checkout: each session is a real payment attempt. */
export const checkoutLimiter = build(10);