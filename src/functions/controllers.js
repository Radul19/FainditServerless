import { User, FM_Item } from '../db/Schemas';
import UserPool from './UserPool.js'
// import 'cross-fetch/polyfill';
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from './getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from './deleteImage';
import uploadFile from './uploadFile';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import mongoose from 'mongoose'
import { url } from 'inspector';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
mongoose.connect(process.env.DB)


const ctrl = {};

ctrl.apitest = async (_, res) => {
  res.json({
    msg: 'Hello World test 2',
  });
};



ctrl.registerUser = async (req, res) => {
  console.log("test")
  // console.log(req.body)
  const { address, birth, card_id, confirmPassword, email, genre, middlename, name, num, password } = req.body;


  let attributeList = []

  let data_address = {
    Name: "address",
    // Value: address
    Value: 'direccion de prueba'
  }

  let data_name = {
    Name: "name",
    // Value: name
    Value: 'nombre de prueba'
  }

  let data_middle_name = {
    Name: "middle_name",
    // Value: middlename
    Value: 'apellido de prueba'
  }
  let data_gender = {
    Name: "gender",
    // Value: genre
    Value: 'genero de prueba'
  }
  let data_birthdate = {
    Name: "birthdate",
    // Value: birth
    Value: '2001-01-01'
  }
  let data_phone_number = {
    Name: "phone_number",
    Value: '+58' + num
  }

  let att_address = new CognitoUserAttribute(data_address)
  let att_name = new CognitoUserAttribute(data_name)
  let att_middle_name = new CognitoUserAttribute(data_middle_name)
  let att_gender = new CognitoUserAttribute(data_gender)
  let att_birthdate = new CognitoUserAttribute(data_birthdate)
  let att_phone_number = new CognitoUserAttribute(data_phone_number)

  attributeList.push(att_address)
  attributeList.push(att_name)
  attributeList.push(att_middle_name)
  attributeList.push(att_gender)
  attributeList.push(att_birthdate)
  attributeList.push(att_phone_number)


  UserPool.signUp(email, password, attributeList, null, async (err, data) => {
    if (err) {
      console.log(err)
      res.status(409).json({
        msg: "Error",
        err
      })
    } else {

      console.log(data)

      const newUser = new User({
        name: name,
        middlename,
        email,
        birth,
        phone: '+58' + num,
        id: data.userSub,
        place: "someplace",
        address,
        country: "",
        profile_pic: "profilepicture",
        interest: [],
        market: false,
        viewer: false,
        favorite: {},
        membership: false,
        notifications: [],
      })
      await newUser.save()

      res.status(200).json({
        msg: "Cuenta creada con exito",
      })
    }
  })


};

ctrl.searchEmail = async (req, res) => {
  try {
    const { email } = req.params
    UserPool.signUp(email, '//**--', [], null, (err, data) => {
      if (err) {
        if (err.name === "UsernameExistsException") {
          res.status(400).json({
            msg: 'El correo ya está en uso'
          })

        } else {
          // console.log(err)
          res.status(200).json({
            msg: 'El correo no está en uso'
          })
        }
      } else {
        res.status(500).json({
          msg: 'Situacion inesperada'
        })
      }
    })


    /* ERROR */
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

ctrl.verifyEmailCode = async (req, res) => {
  try {
    const { code, email } = req.body
    let userData = {
      Username: email,
      Pool: UserPool,
    }


    let cognitoUser = new CognitoUser(userData);
    // console.log(cognitoUser)

    // console.log(code,email)

    cognitoUser.confirmRegistration(code, true, async (err, result) => {
      if (err) {
        console.log(err)
        res.status(401).json({
          msg: 'Codigo erroneo'
        })
        return;
      }
      // console.log('call result: ' + result);
      const user = await User.findOne({ email: email })
      res.status(200).json({
        msg: 'Cuenta verificada',
        userData: user
      })
    });


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

ctrl.editInterest = async (req, res) => {
  try {
    const { email, interest } = req.body
    const user = await User.findOne({ email: email })
    user.interest = interest
    await user.save()

    res.status(200).json({
      msg: 'Intereses actualizados'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

ctrl.login = (req, res) => {
  try {
    const { email, password } = req.body

    let authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    var cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (data) => {
        // console.log('Success: ', data)
        const user = await User.findOne({ email: email })
        res.status(200).json({
          msg: 'Cuenta loggeada',
          userData: user
        })
      },
      onFailure: (err) => {
        // console.log('onFailure: ', err)
        res.status(403).json({
          msg: 'Datos incorrectos',
        })
      },
      newPasswordReq: (data) => {
        console.log('newPassReq: ', data)
      }

    })



  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
ctrl.getProfilePicture = async (req, res) => {
  try {
    const { name } = req.params
    if (!name) {
      res.status(400).json({
        msg: 'Missing fileName',
      });
      return;
    }
    console.log(name)

    const fileURL = await getSignedURL(name);

    res.json({
      url: fileURL,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
ctrl.updateProfilePicture = async (req, res) => {
  try {

    const { email, base64 ,old_img} = req.body

    if (!base64) {
      res.status(400).json({
        msg: 'Missing base64',
      });
      return;
    }
    if (!email) {
      res.status(400).json({
        msg: 'Missing email',
      });
      return;
    }

    const img_id = uuidv4()


    // const url = await uploadFile(base64, img_id);
    // const deleteImg = await deleteImage(old_img)

    // const findUser = await User.findOne({ email: email })
    // findUser.profile_pic = img_id
    // await findUser.save()

    res.json({
      url,img_id
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado',
      error
    })
  }
}

//Upload Image to S3
ctrl.uploadFile = async (base64, fileName) => {
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
ctrl.getUrlFile = async (fileName) => {
  try {
    const client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIAVGAEGM4SMMPUU7PH',
        secretAccessKey: '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',
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
ctrl.saveImage = async (req, res) => {

  try {
    const { fileName, ownerId, description, price, base64 } = req.body;
    const updateFile = await ctrl.uploadFile(base64, fileName);
    const getUrlFile = await ctrl.getUrlFile(fileName);

    
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



export default ctrl;

///////// Correcciones
/*
No era necesario crear las funciones "uploadFile" y "getUrlFile" dentro de "ctrl"
ya que la idea de "ctrl" es de tener solo las funciones de las rutas, ademas que estas funciones que creaste
ya se encuentran entre los archivos, pero en si no hay ningun problema porque todo funciona, es mas para
mantener el orden en el código

Yo me equivoqué explicando y no era necesario guardar la URL de la imagen en mongoDB, ya que el url se va a pedir
cada vez que se quiera acceder a la imagen, lo que necesitamos es el nombre del archivo "fileName", quizas allí 
tuviste confución y con razón.

Al momento de retornar la informacion entregas todo lo guardado en MongoDB, no está mal pero hay datos innecesarios
como el "createdAt" "updatedAt" "__v" , no es mucho pero lo mejor es entregar solo lo que necesitamos, como: 
- Descripcion
- Precio
- Nombre de la imagen o su URL temporal
- OwnerID

Y por ultimo, no entendi por que hay tantos Request en postman hahahaha, podias modificar uno sin tener que copiarlo tantas veces

En general esta muy bien y el objetivo se cumple: subir la imagen y retornar la informacion necesaria
*/