import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const {name, addStudy, addJobExperience} = jobFunctions;

//// JOBS ROUTES

//add Study in Jobs
router.post('/addStudy', addStudy);
//add Job Experience
router.post('/addJobExperience', addJobExperience);
//Name
router.post("/name",name );


export default router