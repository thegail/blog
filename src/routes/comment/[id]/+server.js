import { error } from "@sveltejs/kit";
import client from "$lib/server/client.js";

let db = client.db("blog");
let users = db.collection("users");
let articles = db.collection("articles");

export async function POST({ request, cookies, params }) {
  let text = await request.text();
  let user = await users.findOne({ _id: cookies.get("userId") });
  let token = cookies.get("token");
  if (!user || !token || !user.tokens.includes(Bun.sha(token).toHex())) {
    error(401, "Unauthorized");
  }
  if (text.length > 2000) {
    error(400, "Text too long");
  }
  await articles.updateOne(
    { _id: params.id },
    { $push: { comments: { user: user._id, text } } },
  );
  return new Response();
}
