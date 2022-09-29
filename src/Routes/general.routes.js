import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const { promiseTest } = generalFunctions

router.post("/testPromise", promiseTest);

export default router