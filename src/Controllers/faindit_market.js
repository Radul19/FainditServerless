import { FM_Item, denunciate } from '../db/Fm_Schemas';
import UserPool from './UserPool.js'
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from '../Helpers/getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from '../Helpers/deleteImage';
import uploadFile from '../Helpers/uploadFile';
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
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIAVGAEGM4SMMPUU7PH',
        secretAccessKey: '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',
      }
    });

    const buffer = Buffer.from(base64, "base64");

    const bucketParams = {
      Body: buffer,
      Bucket: 'cultalaimagen',
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
    });
    const urlImage = await getSignedUrl(client, command, { expiresIn: 3600 });
    console.log(urlImage)
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




export default fmFunctions;


