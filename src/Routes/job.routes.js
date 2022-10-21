import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const {name, addStudy, addJobExperience, addLanguage, deleteJobExperience, removeLanguage, deleteStudy, updateLanguage, updateJob, editStudy} = jobFunctions;

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
router.post("/deleteJobExperience",deleteJobExperience );
//delete  Language
router.post("/removeLanguage",removeLanguage );
//delete Study
router.post("/deleteStudy",deleteStudy );
//update Language
router.post("/updateLanguage",updateLanguage );
//update Job
router.post("/updateJob",updateJob );
//edit Study
router.post("/editStudy",editStudy );

export default router