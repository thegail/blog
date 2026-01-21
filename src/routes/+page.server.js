import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client = new MongoClient("mongodb://localhost");
let db = client.db("blog");
let users = db.collection("users");
let articles = db.collection("articles");

export async function load({ request, cookies }) {
  let user = await users.findOne({ _id: cookies.get("userId") });
  let token = cookies.get("token");
  if (!user || !token || !user.tokens.includes(Bun.sha(token).toHex())) {
    redirect(307, "/signin");
  }
  let allArticles = await articles.find().sort({ date: -1 }).toArray();
  let allUsers = Object.fromEntries(
    (await users.find().toArray()).map((u) => [u._id, u.name]),
  );
  let client = new S3Client({ region: "us-west-1" });
  let imageRequests = allArticles.flatMap((a) =>
    a.images.map(async (i) => {
      let request = new GetObjectCommand({
        Bucket: "thegail-blog-assets",
        Key: i.key,
      });
      return [i.key, await getSignedUrl(client, request, { expiresIn: 3600 })];
    }),
  );
  let imageURLs = Object.fromEntries(await Promise.all(imageRequests));
  return {
    articles: allArticles,
    users: allUsers,
    me: user._id,
    images: imageURLs,
  };
}
