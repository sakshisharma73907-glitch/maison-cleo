import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";
import { seedDatabase } from "./lib/seedData.js";

async function main() {
  await connectDb();

  if (process.argv.includes("--seed")) {
    await seedDatabase();
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(
      `[server] Maison Cleo API listening on http://localhost:${env.PORT}`,
    );
    if (process.argv.includes("--seed")) {
      console.log("[server] started with seeded demo data");
    }
    console.log(
      env.isStripeConfigured
        ? "[server] Stripe: configured"
        : "[server] Stripe: NOT configured (checkout will return 503)",
    );
  });
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});