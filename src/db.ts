import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = process.env.url;

if (!uri) {
  throw new Error(
    'Environment variable "url" is not set. Please set the MongoDB connection string in process.env.url',
  );
}

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectDb() {
  try {
    await client.connect();
  } catch (error) {
    if ((error as { codeName?: string }).codeName === "AlreadyConnected") {
      return client;
    }

    throw error;
  }

  return client;
}

export function getUsersCollection() {
  const dbName = process.env.DB_NAME || "notification_hub";
  return client.db(dbName).collection("users");
}
