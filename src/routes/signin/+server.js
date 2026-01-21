import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { MongoClient } from "mongodb";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let users = db.collection("users");

export async function POST({ request, cookies }) {
  let body = await request.json();
  let id = body.id;
  cookies.set("userId", id, { path: "/" });
  let challenge = crypto.getRandomValues(new Uint8Array(32)).toHex();
  let result = await users.updateOne(
    { _id: id },
    { $set: { challenge: challenge } },
  );
  if (result.matchedCount === 0) {
    throw new Error("Nope");
  }
  return new Response(JSON.stringify({ challenge }));
}

export async function PUT({ request, cookies }) {
  let body = await request.json();
  let user = await users.findOne({ _id: cookies.get("userId") });
  let verification = await verifyAuthenticationResponse({
    response: body.credential,
    expectedChallenge: isoBase64URL.fromBuffer(
      Uint8Array.fromHex(user.challenge),
    ),
    expectedOrigin: "http://localhost:5173",
    expectedRPID: "localhost",
    credential: {
      counter: user.counter,
      publicKey: Uint8Array.fromHex(user.publicKey),
    },
  });
  if (!verification.verified) {
    throw new Error("Nope");
  }
  let token = crypto.getRandomValues(new Uint8Array(32)).toHex();
  await users.updateOne(
    { _id: cookies.get("userId") },
    { $set: { challenge: null }, $push: { tokens: Bun.sha(token).toHex() } },
  );
  cookies.set("token", token, { path: "/" });
  return new Response("Ok");
}
