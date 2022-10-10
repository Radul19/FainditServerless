import uploadFile from '../helpers/uploadFile';
import upMultipleImages from '../helpers/uploadMultipleImages';
import { v4 as uuidv4 } from 'uuid';
import getMultipleImages from '@/helpers/getMultipleImages';
import { FM_Item } from '../Models/FM_Schemas';
import { WordArray } from 'amazon-cognito-identity-js';
import getPlace from '../helpers/getPlace'


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

const convertFileNameToUrl = async (arr) => {
  await Promise.all(arr.map(async (item) => {
    const imgs_arr = await getMultipleImages(item.fileName)
    item.fileName.splice(0, item.fileName.length, ...imgs_arr)
    return item
  }))
}

searchFunctions.applySearch = async (req, res) => {
  try {
    const { title = false, place = false, price_min = false, price_max = false, categories = false } = req.body;


    const arr = await FM_Item.find({
      price: { $gte: price_min ? price_max : 0, $lte: price_max ? price_max : 99999 },
      title: title ? new RegExp(title, "i") : { $exists: true },
      place: place ? place : { $exists: true },
      categories: categories ? { $in: categories } : { $exists: true },
    });

    await convertToUrl(arr)

    res.send(arr)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
}
searchFunctions.getLocation = async (req, res) => {
  try {

    const {lat,lon} = req.body
    // console.log(lat,lon)

    const {state,city,country} = await getPlace([lon,lat])

    res.send({state,city,country})

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

/* CASES

const arr = await FM_Item.find({ title: new RegExp(title, "i") });

const arr2 = await FM_Item.find({
  price: { $gte: priceMinFilter, $lte: priceMaxFilter },
  title: new RegExp(title, "i"),
});

const arr3 = await FM_Item.find({
  price: { $gte: priceMinFilter, $lte: priceMaxFilter },
  title: new RegExp(title, "i"),
  place: place,
});

const arr4 = await FM_Item.find({
  price: { $gte: priceMinFilter, $lte: priceMaxFilter },
  title: new RegExp(title, "i"),
  categories: { $in: categories },
});

const arr5 = await FM_Item.find({
  price: { $gte: priceMinFilter, $lte: priceMaxFilter },
  title: new RegExp(title, "i"),
  place: place,
  categories: { $in: categories },
});

*/

export default searchFunctions
