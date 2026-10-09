import { connectDb, disconnectDb } from "./config/db.js";
import { seedDatabase } from "./lib/seedData.js";

async function main() {
  await connectDb();
  await seedDatabase();
  await disconnectDb();
}

main().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});