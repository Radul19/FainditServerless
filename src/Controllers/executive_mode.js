//@ts-check4
import simpleUploadFile from '@/helpers/simpleUploadFile';
import { Executive, Vacant, Item, Ticket } from '../Models/Executive_Schemas';
import { v4 as uuidv4 } from 'uuid';
import uploadFile from '@/helpers/uploadFile';
import uploadMultipleImages from '@/helpers/uploadMultipleImages';
import deleteMultipleImages from '@/helpers/deleteMultipleImages';
import { User } from '@/Models/Users_Schemas';
import mongoose from 'mongoose';

const executiveFunctions = {};

/// DELETE THIS AFTER
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

//// 25 / 10 / 2022
executiveFunctions.myExecutiveModes = async (req, res) => {
  try {

    const { name, userID } = req.body
    let result = await Executive.find({
      name: name.length > 0 ? new RegExp(name, "i") : { $exists: true },
      $or: [{ admins: userID }, { ownerID: userID }]
    })
    result = await Promise.all(result.map(item => item.logoAndPhoto()))

    res.send(result)


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

executiveFunctions.registerExecutiveMode = async (req, res) => {
  try {

    const { logo: logoImg, photos: photosArr, ...data } = req.body

    //// THIS NEED TO BE BETTER ---TOFIX
    const logo = uuidv4()
    const logoUrl = await uploadFile(logoImg, logo)
    const { fileNames: photos } = await uploadMultipleImages(photosArr)
    //// ---TOFIX

    const newExecutive = new Executive({ logo, photos, ...data })
    await newExecutive.save()

    res.send(newExecutive)

    // /** */
    // res.status(500).json({
    //   msg: 'Error inesperado'
    // })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.addItem = async (req, res) => {
  try {

    const { ...data } = req.body

    if (data.images) {
      const { fileNames } = await uploadMultipleImages(data.images)
      data.images = fileNames
    }

    const newItem = new Item(data)
    await newItem.save()

    res.send(newItem)


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.editItem = async (req, res) => {
  try {

    const { itemID, images: imagesArr, ...data } = req.body

    const { fileNames: images } = await uploadMultipleImages(imagesArr)


    if (data.old_images) {
      await deleteMultipleImages(data.old_images)
    }

    const result = await Item.findOneAndUpdate({ _id: itemID },
      { images, ...data },
      { new: true })

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.deleteItem = async (req, res) => {
  try {

    const { itemID } = req.body

    const result = await Item.findByIdAndDelete(itemID)

    if (result) {
      await deleteMultipleImages(result.images)
    }

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
executiveFunctions.myItems = async (req, res) => {
  try {

    const { id } = req.params
    console.log(id)

    let result = await Item.find({ marketID: id })

    if (result) {
      result = await Promise.all(result.map(item => item.getImages()))
    }

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
// MY ITEMS

//add Comment
executiveFunctions.addComment = async (req, res) => {
  try {
    const { itemID, userID, comment, stars } = req.body

    const dateNow = new Date()
    const query = { _id: itemID };
    const update = { $set: { reviews: [{ comment: comment, stars: stars, userID: userID, date: dateNow.toISOString(), edited: false }] } };
    await Item.findOneAndUpdate(query, update)


    res.send({ msg: 'Agregado comentario con éxito ' })


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//add Reply
executiveFunctions.addReply = async (req, res) => {
  try {
    const { itemID, commentID, reply } = req.body
    const dateNow = new Date()
    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $set: { "reviews.$.reply": reply, "reviews.$.reply_date": dateNow.toISOString(), "reviews.$.reply_edited": true } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Agregado respuesta con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//edit Comment
executiveFunctions.editComment = async (req, res) => {
  try {
    const { itemID, userID, comentID, comment, stars } = req.body

    const query = { _id: itemID, 'reviews._id': comentID };
    const update = { $set: { "reviews.$.comment": comment, "reviews.$.stars": stars, "reviews.$.edited": true } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Comentario actualizado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//edit Reply
executiveFunctions.editReply = async (req, res) => {
  try {

    const { itemID, commentID, reply } = req.body



    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $set: { "reviews.$.reply": reply } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Respuesta actualizado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//delete Comment
executiveFunctions.deleteComment = async (req, res) => {
  try {
    const { itemID, userID, commentID } = req.body

    const query = { _id: itemID };
    const update = { $pull: { 'reviews': { '_id': commentID } } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Comentario Eliminado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//delete Reply
executiveFunctions.deleteReply = async (req, res) => {
  try {

    const { itemID, userID, commentID } = req.body

    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $unset: { 'reviews.$.reply': 1, "reviews.$.reply_date": 1, 'reviews.$.reply_edited': 1 } };

    await Item.findOneAndUpdate(query, update)


    res.send({ msg: 'Respuesta Eliminado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//add Comment
executiveFunctions.addComment = async (req, res) => {
  try {
    const { itemID, ...data } = req.body

    const item = { ...data, date: new Date().toISOString(), edited: false, _id: new mongoose.Types.ObjectId() }
    const project = {
      projection: { reviews: 1 },
      new: true
    }
    await Item.findOneAndUpdate({ _id: itemID }, { $push: { reviews: item } }, project)


    res.send(item)


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//add Reply
executiveFunctions.addReply = async (req, res) => {
  try {
    const { itemID, commentID, reply } = req.body
    const dateNow = new Date()
    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $set: { "reviews.$.reply": reply, "reviews.$.reply_date": dateNow.toISOString(), "reviews.$.reply_edited": true } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Agregado respuesta con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//edit Comment
executiveFunctions.editComment = async (req, res) => {
  try {
    const { itemID, userID, comentID, comment, stars } = req.body

    const query = { _id: itemID, 'reviews._id': comentID };
    const update = { $set: { "reviews.$.comment": comment, "reviews.$.stars": stars, "reviews.$.edited": true } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Comentario actualizado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//edit Reply
executiveFunctions.editReply = async (req, res) => {
  try {

    const { itemID, commentID, reply } = req.body



    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $set: { "reviews.$.reply": reply } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Respuesta actualizado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//delete Comment
executiveFunctions.deleteComment = async (req, res) => {
  try {
    const { itemID, userID, commentID } = req.body

    const query = { _id: itemID };
    const update = { $pull: { 'reviews': { '_id': commentID } } };

    await Item.findOneAndUpdate(query, update)

    res.send({ msg: 'Comentario Eliminado con éxito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//delete Reply
executiveFunctions.deleteReply = async (req, res) => {
  try {

    const { itemID, userID, commentID } = req.body

    const query = { _id: itemID, 'reviews._id': commentID };
    const update = { $unset: { 'reviews.$.reply': 1, "reviews.$.reply_date": 1, 'reviews.$.reply_edited': 1 } };

    await Item.findOneAndUpdate(query, update)


    res.send({ msg: 'Respuesta Eliminado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//Add Executive Admin ----TO UPDATE
executiveFunctions.addExecutiveAdmin = async (req, res) => {
  try {
    const { executiveID, email } = req.body

    // TO UPDATE ----FIX TWO QUERYS
    let user = await User.findOne({ email: email })
    if (user) {
      const query = { _id: executiveID };
      const update = { $push: { 'admins': user._id } };
      await Executive.findOneAndUpdate(query, update)
      res.send({ msg: 'Agregado Nuevo Admin con Exito' })
    } else {
      res.status(404).json({
        msg: 'No se encontro usuario con el correo ingresado'
      })
    }



  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//delete Executive Admin
executiveFunctions.deleteExecutiveAdmin = async (req, res) => {
  try {

    const { executiveID, userID } = req.body

    const query = { _id: executiveID };
    const update = { $pull: { admins: userID } };

    await Executive.findOneAndUpdate(query, update)


    res.send({ msg: 'Eliminado con Exito Administrador' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

executiveFunctions.getAdmins = async (req, res) => {
  try {

    const { executiveID } = req.body
    let result = await Executive.findOne({ _id: executiveID }).populate('admins')
    if (result) {
      await Promise.all(result.admins.map(user => user.presignedProfile()))
      res.send(result)
    } else {
      res.status(404).json({
        msg: 'Comercio no econtrado'
      })
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

// update Sections
executiveFunctions.updateSections = async (req, res) => {
  try {

    const { marketID, sections } = req.body


    const result = await Executive.findOneAndUpdate({ _id: marketID },
      { sub_categories: sections },
      { new: true })

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//Edit ExecutiveMode
executiveFunctions.editExecutiveMode = async (req, res) => {
  try {
    const { id, name, description, categories, catalogue, social, schedule, delivery, address, logo, photos, rif, place } = req.body



    const query = { _id: id };
    const update = { $set: { "name": name, "description": description, "categories": categories, "catalogue": catalogue, "social": social, "schedule": schedule, "delivery": delivery, "address": address, "logo": logo, "rif": rif, "place": place } };

    await Executive.findOneAndUpdate(query, update)

    res.send([id, name, description, categories, catalogue, social, schedule, delivery, address, logo, photos, rif, place])
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//add Favorites
executiveFunctions.addMarketFav = async (req, res) => {
  try {
    const { userID, marketID } = req.body
    const findUser = await Executive.findById(marketID);
    let favourite = findUser.favorites;

    if (favourite == undefined) {
      await Executive.updateOne({ _id: marketID }, { $set: { favorites: userID } });
      res.json({
        msg: "articulo guardado en favoritos",
      });
    } else {
      if (favourite.indexOf(userID) === -1) {
        favourite.push(userID);
        await Executive.updateOne({ _id: marketID }, { $set: { favorites: favourite } });
        res.json({
          msg: "articulo guardado en favoritos",
        });
      } else {
        favourite.splice(favourite.indexOf(userID), 1);
        await Executive.updateOne({ _id: marketID }, { $set: { favorites: favourite } });
        res.json({
          msg: "Articulo removido de tu lista de favoritos",
        });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//my Markets Fav
executiveFunctions.myMarketsFav = async (req, res) => {
  try {

    const { id } = req.params
    const query = { "favorites": id };

    const result = await Executive.find(query)


    if (result !== null) {
      res.send({
        result
      })
    } else {
      res.status(404).json({
        msg: 'No hay ningun comercio agregado a favorito'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//verify Executive Mode
executiveFunctions.verifyExecutiveMode = async (req, res) => {
  try {
    const { marketID, relationPhoto } = req.body
    const data = new Ticket({ "marketID": marketID, "relationPhoto": relationPhoto });
    await data.save();

    res.json({ msg: "Enviada con éxito foto para ser verificada " })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//approve Executive
executiveFunctions.approveExecutive = async (req, res) => {
  try {
    const { id } = req.body
    const query = { _id: id }
    const update = { $set: { status: 1 } }

    await Ticket.findOneAndUpdate(query, update)


    res.json({ msg: 'Aprobado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
//approve Executive
executiveFunctions.denyExecutive = async (req, res) => {
  try {
    const { id } = req.body
    const query = { _id: id }
    const update = { $set: { status: 3 } }

    await Ticket.findOneAndUpdate(query, update)


    res.json({ msg: 'Denegado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//Edit ExecutiveMode
executiveFunctions.editExecutiveMode = async (req, res) => {
  try {
    const { id, name, description, categories, catalogue, social, schedule, delivery, address, logo, photos, rif, place } = req.body



    const query = { _id: id };
    const update = { $set: { "name": name, "description": description, "categories": categories, "catalogue": catalogue, "social": social, "schedule": schedule, "delivery": delivery, "address": address, "logo": logo, "rif": rif, "place": place } };

    await Executive.findOneAndUpdate(query, update)

    res.send([id, name, description, categories, catalogue, social, schedule, delivery, address, logo, photos, rif, place])
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//add Favorites
executiveFunctions.addMarketFav = async (req, res) => {
  try {
    const { userID, marketID } = req.body
    const findUser = await Executive.findById(marketID);
    let favourite = findUser.favorites;

    if (favourite == undefined) {
      await Executive.updateOne({ _id: marketID }, { $set: { favorites: userID } });
      res.json({
        msg: "articulo guardado en favoritos",
      });
    } else {
      if (favourite.indexOf(userID) === -1) {
        favourite.push(userID);
        await Executive.updateOne({ _id: marketID }, { $set: { favorites: favourite } });
        res.json({
          msg: "articulo guardado en favoritos",
        });
      } else {
        favourite.splice(favourite.indexOf(userID), 1);
        await Executive.updateOne({ _id: marketID }, { $set: { favorites: favourite } });
        res.json({
          msg: "Articulo removido de tu lista de favoritos",
        });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//my Markets Fav
executiveFunctions.myMarketsFav = async (req, res) => {
  try {

    const { id } = req.params
    const query = { "favorites": id };

    const result = await Executive.find(query)


    if (result !== null) {
      res.send({
        result
      })
    } else {
      res.status(404).json({
        msg: 'No hay ningun comercio agregado a favorito'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//verify Executive Mode
executiveFunctions.verifyExecutiveMode = async (req, res) => {
  try {
    const { marketID, relationPhoto } = req.body
    const data = new Ticket({ "marketID": marketID, "relationPhoto": relationPhoto });
    await data.save();

    res.json({ msg: "Enviada con éxito foto para ser verificada " })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//approve Executive
executiveFunctions.approveExecutive = async (req, res) => {
  try {
    const { id } = req.body
    const query = { _id: id }
    const update = { $set: { status: 1 } }

    await Ticket.findOneAndUpdate(query, update)


    res.json({ msg: 'Aprobado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
//approve Executive
executiveFunctions.denyExecutive = async (req, res) => {
  try {
    const { id } = req.body
    const query = { _id: id }
    const update = { $set: { status: 3 } }

    await Ticket.findOneAndUpdate(query, update)


    res.json({ msg: 'Denegado con éxito' })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

export default executiveFunctions
//
// executiveFunctions.name = async (req, res) => {
//   try {
//
//
// res.send('Hello Word')
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }