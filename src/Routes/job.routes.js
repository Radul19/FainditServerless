import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const { getExperience, addStudy, addJobExperience, addLanguage, deleteJobExperience, removeLanguage, deleteStudy, editStudy, editJob, editLanguage, saveCv, editCv, deleteCv, searchVacant, getAllVacants, applyToVacant, vacantAddFav, vacantDelFav, myRequest,delRequest, approveVacant, denyVacant } = jobFunctions;

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
//edit study
router.post('/editStudy', editStudy);
//edit job
router.post('/editJob', editJob);
//edit langauge
router.post('/editLanguage', editLanguage);
//save CV
router.post('/saveCv', saveCv);
//edit Cv
router.post('/editCv', editCv);
//delete Cv
router.post('/deleteCv', deleteCv);
//apply to vacant
router.post('/applyToVacant', applyToVacant);
// searh
router.post('/searchVacant', searchVacant);
// searh all vacants
router.get('/getAllVacants', getAllVacants);

// vacant to favorites
router.post('/vacantAddFav', vacantAddFav);
// vacant to favorites
router.post('/vacantDelFav', vacantDelFav);

// search my request vacants
router.post('/myRequest', myRequest);
// delete request vacants
router.post('/delRequest', delRequest);
// approve Vacant
router.post('/approveVacant', approveVacant);
//deny Vacant
router.post('/denyVacant', denyVacant);

export default router