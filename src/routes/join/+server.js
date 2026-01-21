import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

export async function POST({ request, cookies }) {
  let db = client().db("blog");
  let codes = db.collection("codes");
  let users = db.collection("users");

  let body = await request.json();
  let hash = Buffer.from(Bun.sha(body.code)).toString("hex");
  let result = await codes.updateOne(
    { _id: hash, used: false },
    { $set: { used: true } },
  );
  if (result.matchedCount == 0) {
    error(404, "Invalid join link");
  }
  let id = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "hex",
  );
  let challenge = Buffer.from(
    crypto.getRandomValues(new Uint8Array(32)),
  ).toString("hex");
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
  let db = client().db("blog");
  let codes = db.collection("codes");
  let users = db.collection("users");

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
  let token = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "hex",
  );
  cookies.set("token", token, { path: "/" });
  await users.updateOne(
    { _id: body.id },
    {
      $set: {
        publicKey: Buffer.from(
          verification.registrationInfo.credential.publicKey,
        ).toString("hex"),
        counter: verification.registrationInfo.credential.counter,
        credentialId: verification.registrationInfo.credential.id,
        challenge: null,
      },
      $push: {
        tokens: Buffer.from(Bun.sha(token)).toString("hex"),
      },
    },
  );
  return new Response("Ok");
}
