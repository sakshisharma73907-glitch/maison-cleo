import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDb(): Promise<void> {
  let uri = env.MONGODB_URI;
  if (env.MONGODB_IN_MEMORY) {
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log(`[db] using in-memory MongoDB (dev only)`);
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    dbName: env.MONGODB_IN_MEMORY ? "maison-cleo" : undefined,
  });
  console.log(`[db] connected to ${env.MONGODB_IN_MEMORY ? "memory://maison-cleo" : env.MONGODB_URI}`);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}