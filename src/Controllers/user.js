import { User, FM_Item } from '../Models/Schemas';
import UserPool from './UserPool.js'
// import 'cross-fetch/polyfill';
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from '../helpers/getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from '../helpers/deleteImage';
import uploadFile from '../helers/uploadFile';
import e from 'express';
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
// ctrl.uploadImage = async (req, res) => {

//   const { base64 } = req.body;
//   const { fileName } = req.body;

//   if (!base64) {
//     res.status(400).json({
//       msg: 'Missing base64',
//     });
//     return;
//   }
//   if (!fileName) {
//     res.status(400).json({
//       msg: 'Missing fileName',
//     });
//     return;
//   }

//   try {
//     const file = await uploadFile(base64, fileName);
//     res.json({
//       url: file,
//     });
//   } catch (err) {
//     res.status(500).json({
//       msg: err.message,
//     });
//   }
// }

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
        if(err.code === 'ExpiredCodeException'){
          res.status(400).json({ msg: 'El codigo que ha insertado no es válido' })
        }else if(err.code === 'LimitExceededException'){
          res.status(400).json({ msg: 'Ha excedido el limite de intentos, intente nuevamente mas tarde', err })
        
        }else{
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
// ctrl.name = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }
export default userFunctions;


// name: The attribute is required
// middle_name: The attribute is required
// gender: The attribute is required
// birthdate: The attribute is required
// phone_number: The attribute is required
// address: The attribute is required


// ctrl.getImage = async (req, res) => {
//   const { fileName } = req.query;

//   if (!fileName) {
//     res.status(400).json({
//       msg: 'Missing fileName',
//     });
//     return;
//   }

//   const fileURL = await getSignedUrl(String(fileName));

//   res.json({
//     url: fileURL,
//   });
// };

// ctrl.uploadImage = async (req, res) => {
//   const { base64 } = req.body;
//   const { fileName } = req.body;

//   if (!base64) {
//     res.status(400).json({
//       msg: 'Missing base64',
//     });
//     return;
//   }
//   if (!fileName) {
//     res.status(400).json({
//       msg: 'Missing fileName',
//     });
//     return;
//   }

//   try {
//     const file = await uploadFile(base64, fileName);
//     res.json({
//       url: file,
//     });
//   } catch (err) {
//     res.status(500).json({
//       msg: err.message,
//     });
//   }
// };