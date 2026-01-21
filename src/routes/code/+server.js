import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

export async function POST({ request }) {
  let db = client().db("blog");
  let codes = db.collection("codes");

  if (
    !Bun.password.verify(
      request.headers.get("Authorization"),
      "$argon2id$v=19$m=65536,t=2,p=1$4xQKNEIPfS0wykKUOHvhKGkYbP0hOIEo6Nl//Y71bno$MkaXsKk6rluFaqD43jqZRLkgJVGqhAuq0hn1L5pdMsE",
    )
  ) {
    error(401, "Unauthorized");
  }
  let code = crypto.getRandomValues(new Uint8Array(32)).toHex();
  await codes.insertOne({ _id: Bun.sha(code).toHex(), used: false });
  return new Response(null, {
    status: 201,
    headers: { Location: `https://blog.thegail.co/join/${code}` },
  });
}
