import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const { getExperience, addStudy, addJobExperience, addLanguage, deleteJobExperience, removeLanguage, deleteStudy } = jobFunctions;

//// JOBS ROUTES

//add Study in Jobs
router.post('/addStudy', addStudy);
//add Job Experience in Jobs
router.post('/addJobExperience', addJobExperience);
//add Study in Jobs
router.post('/addLanguage', addLanguage);
//get all experience
router.get("/getExperience/:userId", getExperience);
//delete Job Experience
router.post("/deleteJob", deleteJobExperience);
//delete  Language
router.post("/deleteLanguage", removeLanguage);
//delete Study
router.post("/deleteStudy", deleteStudy);

export default router