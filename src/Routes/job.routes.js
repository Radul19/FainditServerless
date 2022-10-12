import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const {name, addStudy, addJobExperience, addLanguage, deleteJobExperience, removeLanguage, deleteStudy} = jobFunctions;

//// JOBS ROUTES

//add Study in Jobs
router.post('/addStudy', addStudy);
//add Job Experience in Jobs
router.post('/addJobExperience', addJobExperience);
//add Study in Jobs
router.post('/addLanguage', addLanguage);
//Name
router.post("/name",name );
//delete Job Experience
router.delete("/deleteJobExperience",deleteJobExperience );
//delete  Language
router.delete("/removeLanguage",removeLanguage );
//delete Study
router.delete("/deleteStudy",deleteStudy );

export default router