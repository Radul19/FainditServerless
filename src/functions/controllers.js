import { User, FM_Item } from '../db/Schemas';
import UserPool from './UserPool.js'
// import 'cross-fetch/polyfill';
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import getSignedURL from './getSignedURL';
import { v4 as uuidv4 } from 'uuid';
import deleteImage from './deleteImage';
import uploadFile from './uploadFile';
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


    /** ERROR */
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


    const url = await uploadFile(base64, img_id);
    const deleteImg = await deleteImage(old_img)

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
// ctrl.name = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }
export default ctrl;


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