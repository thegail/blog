import { MongoClient } from "mongodb";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let users = db.collection("users");
let articles = db.collection("articles");

export async function POST({ request, cookies, params }) {
  let text = await request.text();
  let user = await users.findOne({ _id: cookies.get("userId") });
  if (!user || !user.tokens.includes(Bun.sha(cookies.get("token")).toHex())) {
    throw new Error("Nope");
  }
  await articles.updateOne(
    { _id: params.id },
    { $push: { comments: { user: user._id, text } } },
  );
  return new Response();
}
