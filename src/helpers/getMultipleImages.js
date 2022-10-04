import getSignedURL from './getSignedURL';

export default async (id_array) => {
  const getImg = (fileName) => {
    return new Promise(async (res, rej) => {
      res(await getSignedURL(fileName))
    })
  }
  let urls = await Promise.all(id_array.map(id => getImg(id)))
  // console.log(urls)

  return urls


}
