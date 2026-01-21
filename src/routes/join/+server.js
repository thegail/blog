import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

let db = client.db("blog");
let codes = db.collection("codes");
let users = db.collection("users");

export async function POST({ request, cookies }) {
  let body = await request.json();
  let hash = Bun.sha(body.code).toHex();
  let result = await codes.updateOne(
    { _id: hash, used: false },
    { $set: { used: true } },
  );
  if (result.matchedCount == 0) {
    error(404, "Invalid join link");
  }
  let id = crypto.getRandomValues(new Uint8Array(32)).toHex();
  let challenge = crypto.getRandomValues(new Uint8Array(32)).toHex();
  await users.insertOne({
    _id: id,
    name: body.name,
    code: body.code,
    challenge: challenge,
    tokens: [],
  });
  cookies.set("userId", id, { path: "/" });
  return new Response(JSON.stringify({ challenge, id }));
}

export async function PUT({ request, cookies }) {
  let body = await request.json();
  let user = await users.findOne({ _id: body.id });
  if (!user.challenge) {
    error(400, "Missing challenge");
  }
  let verification = await verifyRegistrationResponse({
    response: body.credential,
    expectedChallenge: isoBase64URL.fromBuffer(
      Uint8Array.fromHex(user.challenge),
    ),
    expectedOrigin: "http://localhost:5173",
    expectedRPID: "localhost",
  });
  if (!verification.verified) {
    error(401, "Verification failed");
  }
  let token = crypto.getRandomValues(new Uint8Array(32)).toHex();
  cookies.set("token", token, { path: "/" });
  await users.updateOne(
    { _id: body.id },
    {
      $set: {
        publicKey: verification.registrationInfo.credential.publicKey.toHex(),
        counter: verification.registrationInfo.credential.counter,
        credentialId: verification.registrationInfo.credential.id,
        challenge: null,
      },
      $push: {
        tokens: Bun.sha(token).toHex(),
      },
    },
  );
  return new Response("Ok");
}
