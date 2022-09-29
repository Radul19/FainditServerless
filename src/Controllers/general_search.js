import uploadFile from '../Helpers/uploadFile';
import { v4 as uuidv4 } from 'uuid';

const searchFunctions = {};

searchFunctions.promiseTest = async (req, res) => {

  const { img_1 } = req.body

  try {

    let result

    let id_1 = uuidv4()
    let id_2 = uuidv4()
    let id_3 = uuidv4()
    let id_4 = uuidv4()

    var p1 = new Promise(async (resolve, reject) => {
      // setTimeout(resolve, 1000, "one");
      console.log(id_1)
      const result = await uploadFile(img_1, id_1)
      resolve(result)
    });
    var p2 = new Promise(async (resolve, reject) => {
      console.log(id_2)
      const result = await uploadFile(img_1, id_2)
      resolve(result)
    });
    var p3 = new Promise((resolve, reject) => {
      setTimeout(resolve, 3000, "three");
    });
    var p4 = new Promise((resolve, reject) => {
      setTimeout(resolve, 4000, "four");
    });
    // var p5 = new Promise((resolve, reject) => {
    //   reject("reject");
    // });

    await Promise.all([p1, p2, p3, p4]).then(values => {
      result = values
      console.log(values);
    }, reason => {
      console.log(reason)
    });



    res.send({
      ok: true,
      result
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado',
      error
    })
  }
}
// searchFunctions.name = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }

export default searchFunctions