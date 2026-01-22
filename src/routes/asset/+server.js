import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { error } from "@sveltejs/kit";

export async function POST({ request }) {
  if (
    !Bun.password.verify(
      request.headers.get("Authorization"),
      "$argon2id$v=19$m=65536,t=2,p=1$4xQKNEIPfS0wykKUOHvhKGkYbP0hOIEo6Nl//Y71bno$MkaXsKk6rluFaqD43jqZRLkgJVGqhAuq0hn1L5pdMsE",
    )
  ) {
    error(401, "Unauthorized");
  }

  let body = await request.json();
  let id = crypto.getRandomValues(new Uint8Array(8)).toHex();
  let key = `${id}.${body.extension}`;
  console.log("Building S3 Client...");
  let client = new S3Client({ region: "us-west-1" });
  let command = new PutObjectCommand({
    Bucket: "thegail-blog-assets",
    Key: key,
  });
  console.log("Getting signed URL...");
  let url = await getSignedUrl(client, command, { expiresIn: 3600 });
  console.log("Done");
  return new Response(null, {
    status: 201,
    headers: { Location: url },
  });
}
