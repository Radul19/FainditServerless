import { Router } from "express";

import jobFunctions from "../Controllers/jobs_functions";

const router = Router();

const {name } = jobFunctions;

//// JOBS ROUTES

router.post("/name",name );


export default router