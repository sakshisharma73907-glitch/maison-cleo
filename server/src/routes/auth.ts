import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { signAccessToken } from "../lib/token.js";
import { setAuthCookie, clearAuthCookie } from "../lib/cookies.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { HttpError } from "../lib/HttpError.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../lib/rateLimit.js";
import { mergeGuestCart, getCartToken } from "../lib/cartIdentity.js";

export function userPayload(u: {
  _id: unknown;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}) {
  return {
    id: String(u._id),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
  };
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const body = req.validated as z.infer<typeof registerSchema>;

    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) throw new HttpError(409, "An account with this email already exists");

    const user = await User.create({
      email: body.email,
      password: body.password,
      firstName: body.firstName ?? "",
      lastName: body.lastName ?? "",
      role: "customer",
    });

    await mergeGuestCart(String(user._id), getCartToken(req));

    setAuthCookie(res, signAccessToken({ sub: String(user._id), role: user.role }));
    res.status(201).json({ user: userPayload(user) });
  }),
);

authRouter.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const body = req.validated as z.infer<typeof loginSchema>;

    const user = await User.findOne({ email: body.email.toLowerCase() }).select(
      "+password",
    );
    if (!user) throw new HttpError(401, "Invalid email or password");

    const ok = await user.comparePassword(body.password);
    if (!ok) throw new HttpError(401, "Invalid email or password");

    await mergeGuestCart(String(user._id), getCartToken(req));

    setAuthCookie(res, signAccessToken({ sub: String(user._id), role: user.role }));
    res.json({ user: userPayload(user) });
  }),
);

authRouter.post(
  "/logout",
  (_req, res) => {
    clearAuthCookie(res);
    res.json({ ok: true });
  },
);

authRouter.get(
  "/me",
  requireAuth,
  (req, res) => {
    res.json({ user: req.user ? userPayload(req.user) : null });
  },
);
