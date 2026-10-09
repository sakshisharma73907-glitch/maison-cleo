import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { HttpError } from "../lib/HttpError.js";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
};

type MongoError = {
  name?: string;
  code?: number;
  keyPattern?: Record<string, unknown>;
  errors?: Record<string, { message?: string }>;
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next,
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err instanceof Error && err.name === "ZodError") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const mongo = err as MongoError;
  if (mongo.name === "ValidationError") {
    const issues = Object.values(mongo.errors ?? {})
      .map((e) => e.message)
      .filter(Boolean);
    return res
      .status(400)
      .json({ error: "Validation error", details: issues });
  }

  if (mongo.code === 11000) {
    const fields = Object.keys(mongo.keyPattern ?? {});
    return res.status(409).json({
      error: "A record with that value already exists",
      details: fields,
    });
  }

  if (mongo.name === "CastError") {
    return res.status(400).json({ error: "Invalid identifier" });
  }

  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
};