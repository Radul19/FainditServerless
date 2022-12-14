import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

export default async (img_id) => {
  const bucketParams = { Bucket: "faindit", Key: `images/${img_id}.png` };
  try {
    if (img_id === "profilepicture") {
      return true
    } else {
      const data = await client.send(new DeleteObjectCommand(bucketParams));
      return true; // For unit tests.
    }
  } catch (err) {
    console.log("Error", err);
    // throw new Error(err.message);
    return err
  }
};

