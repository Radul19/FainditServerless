import { GetBucketAnalyticsConfigurationCommand } from "@aws-sdk/client-s3";
import { User } from "../Models/Users_Schemas";
import mongoose from 'mongoose'
import { Executive, Vacant } from "@/Models/Executive_Schemas";
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

jobFunctions.editStudy = async (req, res) => {
  try {

    const { title, place, level, studying, since, until, _id, userID } = req.body
    const result = await User.findOneAndUpdate(
      { _id: userID, "degrees._id": _id },
      {
        $set: {
          "degrees.$.title": title,
          "degrees.$.place": place,
          "degrees.$.level": level,
          "degrees.$.studying": studying,
          "degrees.$.since": since,
          "degrees.$.until": until,
        }
      }, {
      projection: { degrees: 1 },
      new: true
    }
    )

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
jobFunctions.editJob = async (req, res) => {
  try {

    const { name, company, details, working, since, until, _id, userID } = req.body
    console.log(req.body)

    const result = await User.findOneAndUpdate(
      { _id: userID, "jobs._id": _id },
      {
        $set: {
          "jobs.$.name": name,
          "jobs.$.company": company,
          "jobs.$.details": details,
          "jobs.$.working": working,
          "jobs.$.since": since,
          "jobs.$.until": until,
        }
      }, {
      projection: { jobs: 1 },
      new: true
    }
    )

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
jobFunctions.editLanguage = async (req, res) => {
  try {

    const { name, level, _id, userID } = req.body

    const result = await User.findOneAndUpdate(
      { _id: userID, "languages._id": _id },
      {
        $set: {
          "languages.$.name": name,
          "languages.$.level": level,
        }
      }, {
      projection: { languages: 1 },
      new: true
    }
    )

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

jobFunctions.saveCv = async (req, res) => {
  try {

    const { userID, ...cvData } = req.body

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $push: { professionalProfiles: cvData } },
      { projection: { professionalProfiles: 1 }, new: true })

    res.send({ result, msg: 'Experiencia laboral registrada con exito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

jobFunctions.editCv = async (req, res) => {
  try {

    const { userID, _id, ...cvData } = req.body

    const result = await User.findOneAndUpdate(
      { _id: userID, "professionalProfiles._id": _id },
      { $set: { "professionalProfiles.$": cvData } },
      { projection: { professionalProfiles: 1 }, new: true })

    res.send({ result, msg: 'Experiencia laboral editada con exito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

jobFunctions.deleteCv = async (req, res) => {
  try {

    const { userID, _id } = req.body

    const objId = mongoose.Types.ObjectId(_id)

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { professionalProfiles: { _id: _id } } },
      { projection: { professionalProfiles: 1 }, new: true })

    res.send({ result, msg: 'Experiencia laboral eliminada con exito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

jobFunctions.searchVacant = async (req, res) => {
  try {

    res.send(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
jobFunctions.getAllVacants = async (req, res) => {
  try {

    const result = await Vacant.find()

    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
jobFunctions.applyToVacant = async (req, res) => {
  try {

    // const { name, details, qualities, languages, degrees, jobs, skills } = req.body
    const { vacantID, ...data } = req.body

    const result = await Vacant.findOneAndUpdate(
      { _id: vacantID },
      { $push: { applicants: { ...data }, } },
      { projection: { vacants: 1 }, new: true }
    )

    res.json(result);
    // res.send(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


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

/*
{
    "result": {
        "_id": "632c28f724d33c097823fb84",
        "name": "Raul",
        "email": "radulito19@gmail.com",
        "birth": "2001-03-19",
        "phone": "+584146382366",
        "place": "someplace",
        "middlename": "Brito",
        "address": "Avenida@@@@@",
        "country": "",
        "profile_pic": "2fe09ab0-1002-45f7-a3e4-cd53e792c67a",
        "interest": [],
        "market": false,
        "viewer": false,
        "membership": false,
        "notifications": [],
        "createdAt": "2022-09-22T09:20:55.768Z",
        "updatedAt": "2022-10-22T14:11:03.409Z",
        "__v": 1,
        "verified": true,
        "degrees": [
            {
                "title": "Compu",
                "place": "Institu",
                "level": "Basi",
                "studying": true,
                "since": "06/2022",
                "until": "03/2023",
                "_id": "6352e59bd0373defeb0fbfa0"
            },
            {
                "title": "Estudi",
                "place": "Sant",
                "level": "Basic",
                "studying": false,
                "since": "10/2022",
                "until": "10/2022",
                "_id": "6352e6c1ff7e9dc450c59638"
            }
        ],
        "jobs": [
            {
                "name": "Cajero34",
                "company": "Panaderia Acuario",
                "details": "atender los clientes",
                "working": false,
                "since": "08/2013",
                "until": "10/2018",
                "_id": "6351a0ccca7657753098eec1"
            }
        ],
        "languages": [
            {
                "name": "English",
                "level": "Student",
                "_id": "6351a4b70976945c904fc642"
            }
        ],
        "professionalProfiles": [
            {
                "name": "Cajero 2",
                "details": "Cajero details 2",
                "email": "radulito19@gmail.com",
                "phone": "+584146382366",
                "birth": "2001-03-19",
                "qualities": [
                    "creativo",
                    "productivo"
                ],
                "languages": [
                    {
                        "name": "Ingles",
                        "level": "Intermedio"
                    },
                    {
                        "name": "Español",
                        "level": "Nativo"
                    }
                ],
                "degrees": [
                    {
                        "title": "Bachillerato",
                        "place": "Virgen del rosario",
                        "level": "Educacion secundaria",
                        "studying": "false",
                        "since": "2013",
                        "until": "2018"
                    }
                ],
                "jobs": [
                    {
                        "name": "Mesonero",
                        "company": "George's Coffe",
                        "details": "Algunos detalles bla bla bla...",
                        "working": "false",
                        "since": "2019",
                        "until": "2020"
                    }
                ],
                "skills": [
                    "Cajero"
                ],
                "_id": "6353f9f7145eccb0f5a38b09"
            }
        ],
        "stars": [
            3,
            4,
            5
        ],
        "contacts": {
            "whatsapp": "+584146767043",
            "messenger": "",
            "instagram": "",
            "message": "",
            "phone": ""
        }
    },
    "msg": "Experiencia laboral eliminada con exito"
}
*/