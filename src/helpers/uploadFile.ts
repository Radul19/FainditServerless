import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import getSignedUrl from './getSignedURL';

const ACCESSKEYID: string = process.env.ACCESSKEYID ?? 'default'
const SECRETACCESSKEY: string = process.env.SECRETACCESSKEY ?? 'default'

const client = new S3Client({ region: 'us-east-1', 
credentials: {
  accessKeyId: ACCESSKEYID,
  secretAccessKey: SECRETACCESSKEY
} });

export default async (base64: string, fileName: string): Promise<String> => {
  const buffer = Buffer.from(base64, 'base64');

  const command = new PutObjectCommand({
    Body: buffer,
    Bucket: process.env.BUCKET_NAME!,
    Key: `images/${fileName}.png`,
    ContentType: 'image/png',
  });

  try {
    await client.send(command);
    const url = await getSignedUrl(fileName);
    return url;
  } catch (err) {
    // throw new Error(err.message);
    return err
  }
};
