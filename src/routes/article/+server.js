import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

export async function POST({ request }) {
  let db = client().db("blog");
  let articles = db.collection("articles");

  if (
    !Bun.password.verify(
      request.headers.get("Authorization"),
      "$argon2id$v=19$m=65536,t=2,p=1$4xQKNEIPfS0wykKUOHvhKGkYbP0hOIEo6Nl//Y71bno$MkaXsKk6rluFaqD43jqZRLkgJVGqhAuq0hn1L5pdMsE",
    )
  ) {
    error(401, "Unauthorized");
  }
  let body = await request.json();
  let id = crypto.getRandomValues(new Uint8Array(4)).toHex();
  await articles.insertOne({
    _id: id,
    date: new Date().getTime(),
    images: body.images,
    content: body.content,
    comments: [],
  });
  return new Response("Ok");
}
