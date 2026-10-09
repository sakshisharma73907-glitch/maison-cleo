import type { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_COOKIE } from "../lib/cookies.js";
import { verifyAccessToken } from "../lib/token.js";
import { HttpError } from "../lib/HttpError.js";
import User, { type IUser } from "../models/User.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser & { _id: import("mongoose").Types.ObjectId };
    }
  }
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (!token) {
    return next(new HttpError(401, "Authentication required"));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return next(new HttpError(401, "Invalid or expired session"));
  }

  User.findById(payload.sub)
    .then((user) => {
      if (!user) {
        return next(new HttpError(401, "Account no longer exists"));
      }
      req.user = user;
      next();
    })
    .catch(next);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (!req.user) return next(new HttpError(401, "Authentication required"));
    if (req.user.role !== "admin") {
      return next(new HttpError(403, "Admin access required"));
    }
    next();
  });
}

/** Resolves the user from the cookie when present, without failing otherwise. */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (!token) return next();

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return next();
  }

  User.findById(payload.sub)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch(next);
}