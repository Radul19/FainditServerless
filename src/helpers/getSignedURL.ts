import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({ region: 'us-east-1' });

export default async (fileName: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `prueba/${fileName}.png`,
    ResponseContentDisposition: 'inline',
    ResponseContentType: 'image/png',
  });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};
