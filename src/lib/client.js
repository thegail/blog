import { MongoClient } from "mongodb";
import MONGODB_URI from "$env/dynamic/private";

let client = new MongoClient(MONGODB_URI, {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
});

// let client = new MongoClient("mongodb://localhost");

export default client;
