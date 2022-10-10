// Create service client module using ES6 syntax.
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

export async function deleteImages(fileName) {
  try {
    const bucketParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${fileName}.png`,
    };
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
  } catch (err) {}
}
