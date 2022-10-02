import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const { promiseTest, getImages } = generalFunctions

router.post("/testPromise", promiseTest);
router.post("/getImages", getImages);

export default router