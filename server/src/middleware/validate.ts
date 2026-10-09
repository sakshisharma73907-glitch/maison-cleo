import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";
import { HttpError } from "../lib/HttpError.js";

declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
    }
  }
}

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new HttpError(400, "Invalid request", {
          details: result.error.flatten(),
        }),
      );
    }
    req.validated = result.data;
    next();
  };
}