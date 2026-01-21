import { redirect } from "@sveltejs/kit";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client from "$lib/server/client.js";

export async function load({ request, cookies }) {
  let db = client().db("blog");
  let users = db.collection("users");
  let articles = db.collection("articles");

  let user = await users.findOne({ _id: cookies.get("userId") });
  let token = cookies.get("token");
  if (
    !user ||
    !token ||
    !user.tokens.includes(Buffer.from(Bun.sha(token)).toString("hex"))
  ) {
    redirect(307, "/signin");
  }
  let allArticles = await articles.find().sort({ date: -1 }).toArray();
  let allUsers = Object.fromEntries(
    (await users.find().toArray()).map((u) => [u._id, u.name]),
  );
  let awsClient = new S3Client({ region: "us-west-1" });
  let imageRequests = allArticles.flatMap((a) =>
    a.images.map(async (i) => {
      let request = new GetObjectCommand({
        Bucket: "thegail-blog-assets",
        Key: i.key,
      });
      return [
        i.key,
        await getSignedUrl(awsClient, request, { expiresIn: 3600 }),
      ];
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
