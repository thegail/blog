import { MongoClient } from "mongodb";

let client = new MongoClient(process.env.MONGODB_URI, {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
});

// let client = new MongoClient("mongodb://localhost");

export default client;
