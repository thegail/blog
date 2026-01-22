import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { error } from "@sveltejs/kit";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";
import { env } from "$env/dynamic/private";

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
  let client = new S3Client({
    region: "us-west-1",
    credentials: awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
  });
  let command = new PutObjectCommand({
    Bucket: "thegail-blog-assets",
    Key: key,
  });
  let url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return new Response(null, {
    status: 201,
    headers: { Location: url },
  });
}
