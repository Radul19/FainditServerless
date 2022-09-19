import { User, FM_Item } from '../Models/Schemas';
import { VerifyUserReq } from '../Models/C_Side_Schemas';
import UserPool from '../helpers/UserPool'
// import 'cross-fetch/polyfill';
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from '../helpers/getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from '../helpers/deleteImage';
import uploadFile from '../helpers/uploadFile';
import simpleUploadFile from '../helpers/simpleUploadFile';
const userFunctions = {};

userFunctions.apitest = async (_, res) => {
  res.json({
    msg: 'Hello World test 2',
  });
};



userFunctions.registerUser = async (req, res) => {
  // console.log(req.body)
  try {
    const { address, birth, card_id, confirmPassword, email, genre, middlename, name, num, password } = req.body;


    UserPool.signUp(email, password, [], null, async (err, data) => {
      if (err) {
        if (err.code === 'UsernameExistsException') {
          res.status(409).json({
            msg: "El correo con el que se intenta registrar ya esta en uso",
          })
        } else {
          res.status(409).json({
            msg: "Error inesperado, intente nuevamente en unos minutos",
          })
        }
      } else {

        const newUser = new User({
          name,
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
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado,itente nuevamente en unos minutos'
    })
  }



};

userFunctions.searchEmail = async (req, res) => {
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


    /** ERROR */
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

userFunctions.verifyEmailCode = async (req, res) => {
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

userFunctions.editInterest = async (req, res) => {
  try {
    const { email, interest } = req.body
    const user = await User.findOne({ email: email })
    user.interest = interest
    await user.save()

    res.status(200).json({
      msg: 'Intereses actualizados exitosamente!'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado, intente nuevamente en unos minutos'
    })
  }
}

userFunctions.login = async (req, res) => {
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
        console.log(user)
        res.status(200).json({
          msg: 'Cuenta loggeada',
          userData: user
        })
      },
      onFailure: (err) => {
        // console.log('onFailure: ', err)
        if (err.code === 'UserNotConfirmedException') {
          res.status(401).json({
            msg: 'Ingrese el codigo de verificacion enviado a su correo antes de continuar',
            // userData: user
          })
        } else {
          // console.log(err.code)
          res.status(403).json({
            msg: 'Datos incorrectos',
          })
        }
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
userFunctions.getProfilePicture = async (req, res) => {
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
userFunctions.updateProfilePicture = async (req, res) => {
  try {

    const { email, base64, old_img } = req.body

    if (!base64) {
      res.status(400).json({
        msg: 'La imagen seleccionada no es valida, intente con otra imagen',
      });
      return;
    }
    if (!email) {
      res.status(400).json({
        msg: 'El correo en uso no es valido',
      });
      return;
    }

    const img_id = uuidv4()


    // let url = ''

    const url = await uploadFile(base64, img_id);
    const deleteImg = await deleteImage(old_img)

    const findUser = await User.findOne({ email: email })
    findUser.profile_pic = img_id
    await findUser.save()

    res.json({
      url, img_id, deleteImg,
      msg: 'Foto de perfil actualizada con exito!'
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Ha ocurrido un error inesperado, porfavor intente nuevamente en unos minutos',
      error
    })
  }
}

userFunctions.forgotPasswordSend = async (req, res) => {
  try {
    const { email } = req.body

    var cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    // console.log(cognitoUser)

    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        console.log('CodeDeliveryData from forgotPassword: ' + JSON.stringify(data));
        res.json({ msg: 'Se ha enviado el codigo para el cambio de contraseña' })
      },
      onFailure: function (err) {
        console.log(JSON.stringify(err));
        res.status(400).json({ msg: 'Ha ocurrido un error inesperado', err })
      },
    })



  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
userFunctions.forgotPasswordCode = (req, res) => {
  try {

    const { code, newPassword, email } = req.body

    var cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess() {
        console.log('Password confirmed!');
        res.json({ msg: 'Su contraseña ha sido actualizada con exito' })
      },
      onFailure(err) {
        console.log(err)
        if (err.code === 'ExpiredCodeException') {
          res.status(400).json({ msg: 'El codigo que ha insertado no es válido' })
        } else if (err.code === 'LimitExceededException') {
          res.status(400).json({ msg: 'Ha excedido el limite de intentos, intente nuevamente mas tarde', err })

        } else {
          res.status(400).json({ msg: 'Ha ocurrido un error inesperado', err })
        }
      },
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
userFunctions.verifyIDRequest = async (req, res) => {
  try {

    const { id_card_b64, selfie_b64, userId, type } = req.body

    const id_card_filename = uuidv4()
    const selfie_filename = uuidv4()

    const idcard_res = await simpleUploadFile(id_card_b64, id_card_filename)
    const selfie_res = await simpleUploadFile(selfie_b64, selfie_filename)

    if (idcard_res && selfie_res) {
      const newReq = new VerifyUserReq({
        userId,
        id_card_filename,
        selfie_filename,
        type,
      })

      await newReq.save()
      res.json({
        msg: 'Datos eviados correctamente, espere por el equipo de Faindit para verificar su identificación'
      })
    } else {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar procesar las imagenes, intente nuevamente'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado, contate a un administrador para mas informacion'
    })
  }
}
userFunctions.editUserData = async (req, res) => {
  try {

    const { name, phone, middlename, address, id } = req.body
    
    const user = await User.updateOne({ id:id }, { $set: { name,phone,middlename,address } })
    console.log(user.matchedCount > 0 )
    if(user.matchedCount > 0 ){
      res.json({
        msg: 'Datos actualizados con exito'
      })
    }else{
      res.status(404).json({
        msg: 'Usuario no econtrado, los datos no se han actualizado'
      })
    }



  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
// userFunctions.name = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }
export default userFunctions;
