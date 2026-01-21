import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

let clientObject;

function client() {
  if (!clientObject) {
    clientObject = new MongoClient(env.MONGODB_URI, {
      appName: "devrel.vercel.integration",
      maxIdleTimeMS: 5000,
    });
  }
  return clientObject;
}

export default client;
