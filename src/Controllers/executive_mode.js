import simpleUploadFile from '@/helpers/simpleUploadFile';
import { Executive, Vacant } from '../Models/Executive_Schemas';
import { v4 as uuidv4 } from 'uuid';
import uploadFile from '@/helpers/uploadFile';

const executiveFunctions = {};

executiveFunctions.createMarket = async (req, res) => {
  try {

    const { name, relation, description, rif, address, categories, social, extra_links, photos_base64, owner_id, logo_base64 } = req.body

    const logo_filename = uuidv4()
    const photo_filename = uuidv4()


    // const logoResult = new Promise((resolve, reject) => {
    //   const res = simpleUploadFile(logo_base64, logo_filename)
    //   resolve(res)
    // })
    // const photoResult = new Promise((resolve, reject) => {
    //   const res = simpleUploadFile(photos_base64[0], logo_filename)
    //   resolve(res)
    // })
    // const promRes = await Promise.all([logoResult, photoResult]).then((res) => {
    //   return res
    // });
    // console.log(promRes)
    // if (!promRes[0] && !promRes[1]) {
    //   res.status(404).json({
    //     msg: 'Error al subir las imagenes'
    //   })
    // }

    const img_res = simpleUploadFile(logo_base64, logo_filename)


    if (!img_res) {
      res.status(404).json({
        msg: 'Error al subir las imagenes'
      })
    }


    let photos_name = []

    const newExecutive = new Executive({
      name,
      rif,
      social,
      address,
      owner_id,
      relation,
      categories,
      description,
      extra_links,
      photos_name: [],
      logo_filename: '',
      rate: 0,
      delivery: false,
      comments: {},
      schedule: {},
      favorite: [],
      catalogue: [],
      sub_categories: [],
      vacants: [],
    })

    await newExecutive.save()

    res.send({
      ok: true,
      msg: 'Comercio creado con exito'
    })


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.getAllMarkets = async (req, res) => {
  try {

    const result = await Executive.find({}, { name: 1 })

    console.log(result)

    res.send({
      ok: true,
      result
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

executiveFunctions.getMarket = async (req, res) => {
  try {

    const { id } = req.params

    const result = await Executive.findOne({ _id: id })

    if (result !== null) {
      res.send({
        result
      })
    } else {
      res.status(404).json({
        msg: 'No hay ningun comercio asociado con el ID'
      })
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.addVacant = async (req, res) => {
  try {

    const result = new Vacant(req.body)
    await result.save()

    res.json(result);


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.deleteVacant = async (req, res) => {
  try {

    const result = await Vacant.deleteOne({ _id: req.body._id })

    res.json(result);


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}



export default executiveFunctions
// executiveFunctions.name = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }