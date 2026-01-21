import client from "$lib/server/client.js";

let db = client.db("blog");
let users = db.collection("users");

export async function load({ cookies }) {
  let id = cookies.get("userId");
  let challenge = crypto.getRandomValues(new Uint8Array(32)).toHex();
  let result = await users.updateOne(
    { _id: id },
    { $set: { challenge: challenge } },
  );
  if (result.matchedCount === 0) {
    return {};
  }
  return { challenge };
}
