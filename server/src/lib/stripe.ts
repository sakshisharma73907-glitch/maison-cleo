import Stripe from "stripe";
import { env } from "../config/env.js";

let _client: Stripe | null = null;

export function stripeClient(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!_client) {
    _client = new Stripe(env.STRIPE_SECRET_KEY);
  }
  return _client;
}