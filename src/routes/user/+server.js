import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

export async function GET({ request }) {
  let db = client().db("blog");
  let users = db.collection("users");

  if (
    !Bun.password.verify(
      request.headers.get("Authorization"),
      "$argon2id$v=19$m=65536,t=2,p=1$4xQKNEIPfS0wykKUOHvhKGkYbP0hOIEo6Nl//Y71bno$MkaXsKk6rluFaqD43jqZRLkgJVGqhAuq0hn1L5pdMsE",
    )
  ) {
    error(401, "Unauthorized");
  }
  let allUsers = await users
    .find()
    .toArray()
    .map((u) => ({ _id: u._id, email: u.email, name: u.name, code: u.code }));
  return new Response(JSON.stringify(allUsers));
}
