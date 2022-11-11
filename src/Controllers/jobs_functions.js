import { GetBucketAnalyticsConfigurationCommand } from "@aws-sdk/client-s3";
import { User } from "../Models/Users_Schemas";
import mongoose from 'mongoose'
import { Executive, Vacant } from "@/Models/Executive_Schemas";
import { denunciatesVacant } from '../Models/FM_Schemas';
const jobFunctions = {};

///////////////////////////////////////
//////////////  DEGREE  ///////////////
///////////////////////////////////////
//add Study
jobFunctions.addStudy = async (req, res) => {
  try {
    const { userID, ...data } = req.body;

    const result = await User.findOneAndUpdate({ _id: userID },
      { $push: { degrees: { ...data } } },
      { projection: { degrees: 1 }, new: true });

    res.json(result);
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

    const { userID, _id } = req.body

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { degrees: { _id: _id }, "professionalProfiles.$[].degrees": _id } },
      { projection: { professionalProfiles: 1, degrees: 1 }, new: true })

    res.send(result)


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};
//edit Study
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
//////////////////////////////////////
//////////////  JOBS  ////////////////
//////////////////////////////////////
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
//delete Job Experience
jobFunctions.deleteJobExperience = async (req, res) => {
  try {
    const { userID, _id } = req.body;

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { jobs: { _id: _id }, "professionalProfiles.$[].jobs": _id } },
      { projection: { professionalProfiles: 1, jobs: 1 }, new: true })

    res.send(result)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};
// edit job Experience
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
//////////////////////////////////////////
//////////////  LANGUAGES  ///////////////
//////////////////////////////////////////
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
//remove Language
jobFunctions.removeLanguage = async (req, res) => {
  try {
    const { userID, _id } = req.body;

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { languages: { _id: _id }, "professionalProfiles.$[].languages": _id } },
      { projection: { professionalProfiles: 1, languages: 1 }, new: true })

    res.send(result)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};
//edit Language
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
/////////////////////////////////////////////////////
//////////////  PROFESSIONAL PROFILE  ///////////////
/////////////////////////////////////////////////////
//save Professional Profile
jobFunctions.saveCv = async (req, res) => {
  try {

    const { userID, ...cvData } = req.body

    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $push: { professionalProfiles: cvData } },
      { projection: { professionalProfiles: 1 }, new: true })

    console.log(result)

    res.send({ result, msg: 'Experiencia laboral registrada con exito' })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
//edit Professional Profile
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
//delete Professional Profile
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
////////////////////////////////////////
//////////////  VACANTS  ///////////////
////////////////////////////////////////
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

    console.log(data)

    const result = await Vacant.findOneAndUpdate(
      { _id: vacantID },
      { $push: { applicants: { status: 2, ...data }, } },
      { projection: { vacants: 1 }, new: true }
    )

    console.log(result)

    res.json(result);
    // res.send(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}
jobFunctions.vacantAddFav = async (req, res) => {
  try {

    const { userID, vacantID } = req.body

    const result = await Vacant.findOneAndUpdate({ _id: vacantID }, { $push: { favorites: userID } })


    res.json(result);

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'No se ha podido añadir la vacante a favoritos'
    })
  }
}
jobFunctions.vacantDelFav = async (req, res) => {
  try {

    const { userID, vacantID } = req.body

    const result = await Vacant.findOneAndUpdate({ _id: vacantID }, { $pull: { favorites: userID } })


    res.json(result);

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'No se ha podido eliminar la vacante de favoritos'
    })
  }
}

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
jobFunctions.myRequest = async (req, res) => {
  try {

    const { userID } = req.body

    let filter = {
      name: 1,
      place: 1,
      salary: 1,
      duration: 1,
      marketID1: 1,
      description: 1,
      requiriments: 1,
      "applicants.$": 1
    }

    const result = await Vacant.find({ "applicants.userID": userID }, { ...filter })
    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

jobFunctions.delRequest = async (req, res) => {
  try {

    const { userID, vacantID } = req.body


    let filter = {
      name: 1,
      place: 1,
      salary: 1,
      duration: 1,
      marketID1: 1,
      description: 1,
      requiriments: 1,
      "applicants.$": 1
    }

    const result = await Vacant.findOneAndUpdate({ _id: vacantID,"applicants.userID": userID  },
      { $pull: { applicants: { userID: userID } } },
      { $project: filter, returnNewDocument: true })
    res.send(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//approve Vacant
jobFunctions.approveVacant =  async (req, res) => {
  try {
    const { userID, vacantID } = req.body
    const query = { _id:vacantID};
    const update = {$set:{applicants:{userID:userID, status:1}}};  

    await Vacant.findOneAndUpdate(query,update)


    res.send({msg: 'Vacante aprobada'})


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}


//deny Vacant
jobFunctions.denyVacant =  async (req, res) => {
  try {

    const { userID, vacantID } = req.body
    const query = { _id:vacantID};
    const update = {$set:{applicants:{userID:userID, status:3}}};  

    await Vacant.findOneAndUpdate(query,update)


    res.send({msg: 'Vacante rechazada'})

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado'
    })
  }
}

//report Vacant
jobFunctions.reportVacant =  async (req, res) => {
    try {
      const { type, vacantID, description } = req.body
      const denunciates = new denunciatesVacant({
        type: type,
        vacantID: vacantID,
        description: description
      });
  
      await denunciates.save()
  
  
      res.status(200).json({
        msg: 'Vacante reportado con exito'
      })
  
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Error inesperado'
      })
    }
  }




export default jobFunctions;
//
// jobFunctions.name =  async (req, res) => {
//   try {

//     res.send("hola mundo")

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       msg: 'Error inesperado'
//     })
//   }
// }
