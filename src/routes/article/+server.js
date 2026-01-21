import { MongoClient } from "mongodb";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let articles = db.collection("articles");

export async function POST({ request }) {
  if (
    !Bun.password.verify(
      request.headers.get("Authorization"),
      "$argon2id$v=19$m=65536,t=2,p=1$4xQKNEIPfS0wykKUOHvhKGkYbP0hOIEo6Nl//Y71bno$MkaXsKk6rluFaqD43jqZRLkgJVGqhAuq0hn1L5pdMsE",
    )
  ) {
    throw new Error("Nope");
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
