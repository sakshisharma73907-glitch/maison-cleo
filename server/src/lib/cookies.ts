import type { Response } from "express";
import { env } from "../config/env.js";

export const ACCESS_TOKEN_COOKIE = "mc_at";

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
  });
}