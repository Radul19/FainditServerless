import uploadFile from '../Helpers/uploadFile';
import upMultipleImages from '../Helpers/uploadMultipleImages';
import { v4 as uuidv4 } from 'uuid';
import getMultipleImages from '@/Helpers/getMultipleImages';

const searchFunctions = {};

searchFunctions.promiseTest = async (req, res) => {
  try {
    const { imgArray } = req.body
    const { urls, fileNames } = await upMultipleImages(imgArray)
    
    res.send({
      ok: true,
      urls,
      fileNames
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado',
      error
    })
  }
}
searchFunctions.getImages = async (req, res) => {
  try {

    const { fileNames } = req.body

    const result = await getMultipleImages(fileNames)

    res.send({
      result
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
// searchFunctions.name = async (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }

export default searchFunctions