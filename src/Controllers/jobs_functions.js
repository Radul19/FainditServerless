import { GetBucketAnalyticsConfigurationCommand } from "@aws-sdk/client-s3";
import { User } from "../Models/Users_Schemas";
const jobFunctions = {};


//add Study
jobFunctions.addStudy = async (req, res) => {
  try {
    const { userID, until, since, studying, level, place, title } = req.body;

    const result = await User.findOneAndUpdate({ _id: userID }, {
      $push: {
        degrees: {
          title,
          place,
          level,
          studying,
          since,
          until,
        }
      }
    },
      {
        projection: {
          degrees: 1
        },
        new: true
      }
    );

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//add Job Experience
jobFunctions.addJobExperience = async (req, res) => {
  try {
    const { name, company, details, working, since, until, userID } = req.body;

    const result = await User.findOneAndUpdate({ _id: userID }, {
      $push: { jobs: { name, company, details, working, since, until, userID } }
    }, {
      projection: { jobs: 1 },
      new: true
    }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//add Language in jobs
jobFunctions.addLanguage = async (req, res) => {
  try {
    const { name, level, userID } = req.body;
    console.log(name)
    console.log(level)
    console.log(userID)

    const result = await User.findOneAndUpdate({ _id: userID }, {
      $push: { languages: { name, level } }
    }, {
      projection: { languages: 1 },
      new: true
    }
    );
    res.json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//get All Experiences
jobFunctions.getExperience = async (req, res) => {
  try {

    const { userId } = req.params

    const result = await User.findOne({ _id: userId }, { degrees: 1, jobs: 1, languages: 1 })

    res.send(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};


//delete Job Experience
jobFunctions.deleteJobExperience = async (req, res) => {
  try {
    const { userID, id } = req.body;
    const dataUser = await User.findById(userID);
    const jobs = dataUser.jobs;

    let idNum = jobs.findIndex((element) => {
      return element.id === id;
    });

    if (idNum == -1) {
      res.status(500).json({
        msg: "Error inesperado",
      });
    } else {
      jobs.splice(idNum, 1);

      await User.updateOne({ _id: userID }, { jobs: jobs });
      res.send({
        msg: "Información guardada con exito",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//remove Language
jobFunctions.removeLanguage = async (req, res) => {
  try {
    const { userID, id } = req.body;
    const dataUser = await User.findById(userID);
    const languages = dataUser.languages;

    let idNum = languages.findIndex((element) => {
      return element.id === id;
    });

    if (idNum == -1) {
      res.status(500).json({
        msg: "Error inesperado",
      });
    } else {
      languages.splice(idNum, 1);

      await User.updateOne({ _id: userID }, { languages: languages });
      res.send({
        msg: "Información guardada con exito",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

//delete Study
jobFunctions.deleteStudy = async (req, res) => {
  try {
    const { userID, id } = req.body;

    const dataUser = await User.findById(userID);
    const degrees = dataUser.degrees;

    let idNum = degrees.findIndex((element) => {
      return element.id === id;
    });

    if (idNum == -1) {
      res.status(500).json({
        msg: "Error inesperado",
      });
    } else {
      degrees.splice(idNum, 1);

      await User.updateOne({ _id: userID }, { degrees: degrees });
      res.send({
        msg: "Estudio eliminado con exito",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

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
