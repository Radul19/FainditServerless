//@ts-check
import { User } from "../Models/Users_Schemas";
const jobFunctions = {};

jobFunctions.name = (req, res) => {
  try {
    res.send(true);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//add Study
jobFunctions.addStudy = async (req, res) => {
  try {
    const { userID, unitil, since, studying, level, place, title } = req.body;
 await User.updateOne(
      { _id: userID },
      {
        degrees: [
          {
            title: title,
            place: place,
            level: level,
            studying: studying,
            since: since,
            unitil: unitil
          },
        ],
      }
    );
    res.json({
      msg: "Información guardada con exito",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};


jobFunctions.addJobExperience = async (req, res) => {
  try {
    const { name, company, details, working, since, until, userID } = req.body;
 await User.updateOne(
      { _id: userID },
      {
        jobs: [
          {
            name: name,
            company: company,
            details: details,
            working: working,
            since: since,
            until: until
          },
        ],
      }
    );
    res.json({
      msg: "Información guardada con exito",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

export default jobFunctions;
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
