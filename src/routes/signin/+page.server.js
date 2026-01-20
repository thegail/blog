import { MongoClient } from "mongodb";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let users = db.collection("users");

export async function load({ cookies }) {
  let id = cookies.get("userId");
  let challenge = crypto.getRandomValues(new Uint8Array(32)).toHex();
  await users.updateOne({ _id: id }, { $set: { challenge: challenge } });
  return { challenge };
}
