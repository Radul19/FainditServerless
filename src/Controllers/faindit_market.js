import { FM_Item, denunciate } from '../Models/FM_Schemas';
import { User } from '../Models/Users_Schemas';
import UserPool from '../helpers/UserPool'
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from '../helpers/getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from '../helpers/deleteImage';
import uploadFile from '../helpers/uploadFile';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import mongoose from 'mongoose'
import { url } from 'inspector';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import uploadMultipleImages from '@/helpers/uploadMultipleImages';
import getMultipleImages from '@/helpers/getMultipleImages';
import { deleteImages } from '../helpers/deleteFile'
mongoose.connect(process.env.DB)

const fmFunctions = {};

//Take all the Image Names of S3 and replace them with PresignedUrl
const convertFileNameToUrl = async (arr) => {
  await Promise.all(arr.map(async (item) => {
    const imgs_arr = await getMultipleImages(item.fileName)
    item.fileName.splice(0, item.fileName.length, ...imgs_arr)
    return item
  }))
}

//Upload Image to S3
fmFunctions.uploadFile = async (base64, key, ownerId, id) => {
  try {
    const s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
      },
    });


    const buffer = Buffer.from(base64, "base64");

    const bucketParams = {
      Body: buffer,
      Bucket: process.env.BUCKET_NAME,
      Key: `imagesFm/${ownerId}/${id}/${key}.png`,
      ContentType: "image/png",
      acl: "public-read",
    };
    s3Client.send(new PutObjectCommand(bucketParams));
    //console.log("Success");

  } catch (err) {
    // error handling.
    console.log("Error", err.message);
    //return res.status(500).send({ error: "Unexpected error during file upload" });
  }
};
//Get Url the in Objet
fmFunctions.getUrlFile = async (key, ownerId, id) => {
  try {
    const client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
      }
    });

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `imagesFm/${ownerId}/${id}/${key}.png`,
      ResponseContentDisposition: "inline",
      ResponseContentType: "image/png",
    });
    const urlImage = await getSignedUrl(client, command);//{ expiresIn: 3600 } <-- time the images
    //console.log(urlImage)
    return urlImage;
  } catch (error) {
    console.log(error);
  }
};

//Save the image in the database
fmFunctions.saveImage = async (req, res) => {

  try {
    const { fileName, ownerId, description, price, base64 } = req.body;
    const updateFile = await fmFunctions.uploadFile(base64, fileName);
    const getUrlFile = await fmFunctions.getUrlFile(fileName);


    const fm_Item = new FM_Item({
      fileName: fileName,
      ownerId: ownerId,
      description: description,
      price: price,
      base64: getUrlFile
    });

    const imageSaved = await fm_Item.save()

    return res.json({ imageSaved });


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
//report an item on the marketplaces
fmFunctions.denunciate = async (req, res) => {

  try {
    const denunciates = new denunciate({
      type: req.body.type,
      item_id: req.body.item_id,
      description: req.body.description
    });

    await denunciates.save()


    res.status(200).json({
      msg: 'Articulo reportado con exito'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
//add Favorites
fmFunctions.addFavorites = async (req, res) => {
  try {
    const itemId = req.body.item_id;
    const userId = req.body.user_id;
    const findUser = await FM_Item.findById(itemId);
    let favourite = findUser.favorites;

    if (favourite == undefined) {
      await FM_Item.updateOne({ _id: itemId }, { $set: { favorites: userId } });
      res.json({
        msg: "articulo guardado en favoritos",
      });
    } else {
      if (favourite.indexOf(userId) === -1) {
        favourite.push(userId);
        await FM_Item.updateOne({ _id: itemId }, { $set: { favorites: favourite } });
        res.json({
          msg: "articulo guardado en favoritos",
        });
      } else {
        favourite.splice(favourite.indexOf(userId), 1);
        await FM_Item.updateOne({ _id: itemId }, { $set: { favorites: favourite } });
        res.json({
          msg: "Articulo removido de tu lista de favoritos",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//Get all my articles //// RENAMED
fmFunctions.getAllMyFmItems = async (req, res) => {
  try {
    const id = req.params.id;
    const myArticles = await FM_Item.find({ ownerId: id })

    if (myArticles === undefined) res.json([]);

    await Promise.all(myArticles.map(async (item) => {
      const imgs_arr = await getMultipleImages(item.fileName)
      item.fileName.splice(0, item.fileName.length, ...imgs_arr)
      return item
    }))

    res.json(myArticles);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//Edit an article
fmFunctions.editArticle = async (req, res) => {
  try {
    const {
      title,
      ownerId,
      description,
      price,
      fileName,
      item_id,
      categories,
    } = req.body;

    const myArticles = await FM_Item.findById(item_id).exec();
    if (myArticles.ownerId === ownerId) {
      const resultUpdate = await FM_Item.findByIdAndUpdate(
        { _id: item_id },
        {
          $set: {
            title: title,
            price: price,
            description: description,
            fileName: fileName,
            categories: categories,
          },
        }
      );

      //console.log(resultUpdate.nModified);
      res.json({ mgs: "Articulo editado con exito." });
    } else {
      res.json({ mgs: "No tienes permisos para editar este artículo." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};
//F Marked search bar
fmFunctions.findFmiItem = async (req, res) => {
  try {
    /// En caso de no aplicar algun filtro, se envia FALSE y se busca todo del mismo
    const { title = false, place = false, price_min = false, price_max = false, categories = false, stars = false } = req.body;

    const query = {
      price: { $gte: price_min ? price_min : 0, $lte: price_max ? price_max : 99999 },
      title: title ? new RegExp(title, "i") : { $exists: true },
      "place.country": place.country ? place.country : { $exists: true },
      "place.state": place.state ? place.state : { $exists: true },
      "place.city": place.city ? place.city : { $exists: true },
      categories: categories ? { $all: categories } : { $exists: true },
    }

    /// TO UPDATE SEARCH JUST IN CASE
    const updatedResult = await FM_Item.updateMany(query, {
      $inc: { insearch: 1 }
    });


    let result = await FM_Item.find(query)
    let arrUsers

    // IF FILTER BY USER STARS
    if (stars) {

      let arrId = result.map(item => {
        return mongoose.Types.ObjectId(item.ownerId)
      })

      arrUsers = await User.aggregate([{
        $match: {
          $expr: {
            $gte: [{ $avg: '$stars' }, stars],
          },
          "_id": { "$in": arrId }
        },
      },
      { $group: { _id: "$_id" } }])

      arrUsers.forEach((item, index) => {
        arrUsers[index] = item._id.toString()
      })

      result = result.filter(item => arrUsers.includes(item.ownerId)
        // console.log(arrUsers.some(id => id === item.ownerId))
      )

    }

    await convertFileNameToUrl(result)

    res.send(result)
    // res.send({ ok: true })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
}
//Fm item clicked
fmFunctions.fmClickedItem = async (req, res) => {
  try {

    const { itemID } = req.body
    console.log(itemID)
    console.log(req.body)

    await FM_Item.updateOne({ _id: itemID }, { $inc: { viewed: 1 } })

    res.send({ ok: true })

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
}

//Fm item contacted
fmFunctions.fmContactedItem = async (req, res) => {
  try {

    const { itemID } = req.body

    await FM_Item.updateOne({ _id: itemID }, { $inc: { interactions: 1 } })
    res.send({ ok: true })

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
}

//// Funciones temporales para el front
fmFunctions.getAllFmItems = async (req, res) => {
  try {

    const result = await FM_Item.find()

    /// FIX #2 (my fault)
    await Promise.all(result.map(async (item) => {
      const imgs_arr = await getMultipleImages(item.fileName)
      item.fileName.splice(0, item.fileName.length, ...imgs_arr)
      return item
    }))


    if (result) {
      res.send({
        result
      })
    } else {
      res.status(404).json({
        msg: 'No se encontraron resultados'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
fmFunctions.getAllFmFavItems = async (req, res) => {
  const { id } = req.params
  try {

    const result = await FM_Item.find({ favorites: id })
    await convertFileNameToUrl(result)

    if (result) {
      res.send({
        result
      })
    } else {
      res.status(404).json({
        msg: 'No se encontraron resultados'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//create An Article
fmFunctions.createAnArticle = async (req, res) => {
  try {
    let { base64, ...data } = req.body;

    const { fileNames: fileName } = await uploadMultipleImages(base64)

    const fm_Item = new FM_Item({ ...data, fileName })

    await fm_Item.save()

    res.json({
      msg: "Articulo publicado con exito"
    })
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};


//remove Item Fm
fmFunctions.removeItemFm = async (req, res) => {
  try {
    const { item_id, user_id } = req.body;
    const data = await FM_Item.findById(item_id).exec();
    if (user_id == data.ownerId) {
      for (let i = 0; i < data.fileName.length; i++) {
        deleteImages(data.fileName[i]);
      }

      await FM_Item.findByIdAndRemove(item_id);
      res.json({ mgs: "Articulo eliminado con exito" });
    } else {
      res.json({ mgs: "Error este articulo no te pertenece articulo" });
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

fmFunctions.getContactInfo = async (req, res) => {
  try {

    const { id } = req.params

    const userId = mongoose.Types.ObjectId(id)

    const result = await User.aggregate([{
      $match: { "_id": userId }
    }, {
      $project: {
        _id: 1,
        name: 1,
        middlename: 1,
        address: 1,
        profile_pic: 1,
        stars: { $avg: '$stars' },
        contacts: 1,
      }
    }])

    result[0].profile_pic = await getSignedURL(result[0].profile_pic)

    // console.log(result)
    res.send(result[0])
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
}

/*
//
fmFunctions.name = async (req, res) => {
  try {
   
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
}; 
*/


export default fmFunctions;


