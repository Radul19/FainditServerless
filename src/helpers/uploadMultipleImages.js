import uploadFile from './uploadFile';
import { v4 as uuidv4 } from 'uuid';

export default async (imagesArray) => {
  let fileNames = []
  const sendImg = (base64) => {
    return new Promise(async (res, rej) => {
      let fileName = uuidv4()
      fileNames.push(fileName)
      res(await uploadFile(base64, fileName))
    })
  }
  let urls = await Promise.all(imagesArray.map(img => sendImg(img)))

  return { urls, fileNames }


}
