import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

let client = new MongoClient(env.MONGODB_URI, {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
});

// let client = new MongoClient("mongodb://localhost");

export default client;
