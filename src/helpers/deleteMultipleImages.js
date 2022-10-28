import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'us-east-1' });

export default async (imagesArray) => {
  const deleteImg = (filename) => {
    return new Promise(async (res, rej) => {
      const bucketParams = { Bucket: "faindit", Key: `images/${filename}.png` };
      const data = await client.send(new DeleteObjectCommand(bucketParams));
      res(true)
    })
  }
  let results = await Promise.all(imagesArray.map(img => deleteImg(img)))

  return results


}
