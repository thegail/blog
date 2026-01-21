import client from "$lib/server/client.js";

export async function load({ cookies }) {
  let db = client().db("blog");
  let users = db.collection("users");

  let id = cookies.get("userId");
  let challenge = Buffer.from(
    crypto.getRandomValues(new Uint8Array(32)),
  ).toString("hex");
  let result = await users.updateOne(
    { _id: id },
    { $set: { challenge: challenge } },
  );
  if (result.matchedCount === 0) {
    return {};
  }
  return { challenge };
}
