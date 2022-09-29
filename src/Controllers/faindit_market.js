import { FM_Item, denunciate } from '../Models/FM_Schemas';
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
mongoose.connect(process.env.DB)


const fmFunctions = {};

//Upload Image to S3
fmFunctions.uploadFile = async (base64, fileName) => {
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
      Key: `prueba/${fileName}.png`,
      ContentType: "image/png",
      acl: "public-read",
    };
    await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("Success Upload");
    //return data
    // process data.
  } catch (err) {
    // error handling.
    console.log("Error", err.message);
    //return res.status(500).send({ error: "Unexpected error during file upload" });
  }
};
//Get Url the in Objet
fmFunctions.getUrlFile = async (fileName) => {
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
      Key: `prueba/${fileName}.png`,
      ResponseContentDisposition: "inline",
      ResponseContentType: "image/png",
      acl: "public-read"
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

    const denunciatesSaved = await denunciates.save()


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
      const resUpdate = await FM_Item.updateOne({ _id: itemId }, { $set: { favorites: userId } });
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
        const removeFavorite = await FM_Item.updateOne({ _id: itemId }, { $set: { favorites: favourite } });
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

//Get all my articles
fmFunctions.getAllArticles = async (req, res) => {
  try {
    const id = req.params.ownerId;
    const myArticles = await FM_Item.find({ ownerId: id }).select({
      description: 1,
      fileName: 1,
      price: 1,
      base64: 1,
      viewed: 1,
      interactions: 1,
    });
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
      fileName,
      ownerId,
      description,
      price,
      base64,
      item_id,
      categories,
    } = req.body;

    const myArticles = await FM_Item.findById(item_id).exec();
    if (myArticles.ownerId === ownerId) {
      const resultUpdate = await FM_Item.findByIdAndUpdate(
        { _id: item_id },
        {
          $set: {
            fileName: fileName,
            price: price,
            description: description,
            base64: base64,
            categories: categories,
          },
        }
      );

      console.log(resultUpdate.nModified);
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
//FM Markes search bar
fmFunctions.findFmiItem = async (req, res) => {
  try {
    const { texto, place, price_min, price_max, categories } = req.body;
    const priceMinFilter = price_min || 0;
    const priceMaxFilter = price_max || 9999999;

    //The user did not put any filter
    if (
      priceMaxFilter == 9999999 &&
      priceMinFilter == 0 &&
      place == undefined &&
      categories == undefined
    ) {
      const arr = await FM_Item.find({ fileName: new RegExp(texto, "i") });
      res.json(arr);
    } else if (
      priceMaxFilter !== undefined &&
      place == undefined &&
      categories == undefined
    ) {
      //The user put only filter of maximum price or minimum price
      const arr = await FM_Item.find({
        price: { $gte: priceMinFilter, $lte: priceMaxFilter },
        fileName: new RegExp(texto, "i"),
      });
      res.json(arr);
    } else if (
      priceMaxFilter !== undefined &&
      place !== undefined &&
      categories == undefined
    ) {
      //User put only filter put a place (includes max and min by default)

      const arr = await FM_Item.find({
        price: { $gte: priceMinFilter, $lte: priceMaxFilter },
        fileName: new RegExp(texto, "i"),
        place: place,
      });
      res.json(arr);
    } else if (
      priceMaxFilter !== undefined &&
      place !== undefined &&
      categories == undefined
    ) {
      //the user only put place (includes max and min by default)
      const arr = await FM_Item.find({
        price: { $gte: priceMinFilter, $lte: priceMaxFilter },
        fileName: new RegExp(texto, "i"),
        place: place,
      });
      res.json(arr);
    } else if (
      priceMaxFilter !== undefined &&
      place == undefined &&
      categories !== undefined
    ) {
      //The user only put categories (includes max and min by default)
      const arr = await FM_Item.find({
        price: { $gte: priceMinFilter, $lte: priceMaxFilter },
        fileName: new RegExp(texto, "i"),
        categories: { $in: categories },
      });
      res.json(arr);
    } else {
      //the user put both category and place (includes max and min by default)
      const arr = await FM_Item.find({
        price: { $gte: priceMinFilter, $lte: priceMaxFilter },
        fileName: new RegExp(texto, "i"),
        place: place,
        categories: { $in: categories },
      });
      res.json(arr);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//// Funciones temporales para el front
fmFunctions.getAllFmItems = async (req, res) => {
  try {

    const result = await FM_Item.find()

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
  const { userId } = req.params
  try {

    const result = await FM_Item.find({ favorites: userId })

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
    let { name, description, price, categories, base64, place, ownerId } = req.body;
  const allImages = []
  for (let i = 0; i < base64.length; i++) {
    const fileName = i
    const updateFile = await fmFunctions.uploadFile(base64[i], fileName);
    const getUrlFile = await fmFunctions.getUrlFile(fileName);
    allImages.push(getUrlFile);
  }


  const fm_Item = new FM_Item({ 
    fileName: name,
    description: description,
    ownerId: ownerId,
    price: price,
    place: place,
    base64: allImages,
    categories:categories})

 const youArticle = await fm_Item.save()
 
  res.json({
    msg:"Articulo publicado con exito"
  })
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};



export default fmFunctions;


