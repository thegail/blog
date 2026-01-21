import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let users = db.collection("users");
let articles = db.collection("articles");

export async function load({ request, cookies }) {
  let user = await users.findOne({ _id: cookies.get("userId") });
  if (!user || !user.tokens.includes(Bun.sha(cookies.get("token")).toHex())) {
    redirect(307, "/signin");
  }
  let allArticles = await articles.find().sort({ date: -1 }).toArray();
  let allUsers = Object.fromEntries(
    (await users.find().toArray()).map((u) => [u._id, u.name]),
  );
  return { articles: allArticles, users: allUsers, me: user._id };
}
