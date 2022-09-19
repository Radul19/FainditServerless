import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

export default async (base64: string, fileName: string): Promise<Boolean> => {
  const buffer = Buffer.from(base64, 'base64');

  const command = new PutObjectCommand({
    Body: buffer,
    Bucket: process.env.BUCKET_NAME!,
    Key: `images/${fileName}.png`,
    ContentType: 'image/png',
  });

  try {
    await client.send(command);
    return true
  } catch (err) {
    // throw new Error(err.message);
    return err
  }
};
