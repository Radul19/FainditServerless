
const jobFunctions = {};


jobFunctions.name = (req, res) => {
  try {

    res.send(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
export default jobFunctions
// jobFunctions.name = (req, res) => {
//   try {

//     res.send(true)

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }