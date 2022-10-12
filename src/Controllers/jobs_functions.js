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

    const dataUser = await User.findById(userID);
    const dataDegrees = dataUser.degrees;

    dataDegrees.push({
      title: title,
      place: place,
      level: level,
      studying: studying,
      since: since,
      unitil: unitil,
    });
    await User.updateOne({ _id: userID }, { degrees: dataDegrees });
    res.json({
      msg: "Información guardada con exito",
    });
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
    const dataUser = await User.findById(userID);
    const dataJobs = dataUser.jobs;

    dataJobs.push({
      name: name,
      company: company,
      details: details,
      working: working,
      since: since,
      until: until,
    });

    await User.updateOne(
      { _id: userID },
      {
        jobs: dataJobs,
      }
    );
    res.json({
      msg: "Información guardada con exito",
    });
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
    const dataUser = await User.findById(userID);
    const dataLanguage = dataUser.languages;

    dataLanguage.push({
      name: name,
      level: level
    });

    await User.updateOne(
      { _id: userID },
      {
        languages: dataLanguage,
      }
    );
    res.json({ msg: "Información guardada con exito" });
  
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


export default jobFunctions;
//
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
