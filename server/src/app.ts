import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { env } from "./config/env.js";
import { uploadsDir } from "./lib/uploads.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { cartRouter } from "./routes/cart.js";
import { ordersRouter } from "./routes/orders.js";
import { checkoutRouter } from "./routes/checkout.js";
import { webhooksRouter } from "./routes/webhooks.js";
import { adminRouter } from "./routes/admin.js";
import { errorHandler, notFound } from "./middleware/error.js";

// When the frontend is built (../dist from the compiled server), the API
// also serves it so a single deployment hosts the full app.
const clientDist = path.resolve(import.meta.dirname, "../../dist");
const hasClient = fs.existsSync(path.join(clientDist, "index.html"));

export function createApp() {
  const app = express();

  app.set("trust proxy", env.isProd ? 1 : false);
  app.disable("x-powered-by");
  app.use(helmet());

  // Stripe webhooks must see the raw request body (signature verification).
  app.use("/api/payments", webhooksRouter);

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  if (!env.isProd) app.use(morgan("dev"));

  app.use("/uploads", express.static(uploadsDir()));

  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/checkout", checkoutRouter);

  // Admin endpoints carry their own guard.
  app.use("/api/admin", adminRouter);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "maison-cleo-server" });
  });

  // Serve the built React app and let the client router handle non-API paths.
  if (hasClient && env.isProd) {
    app.use(express.static(clientDist, { index: "index.html" }));
    app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}