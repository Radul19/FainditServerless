import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const { promiseTest, getImages,applySearch,getLocation } = generalFunctions

router.post("/testPromise", promiseTest);
router.post("/getImages", getImages);
router.post("/applySearch", applySearch);
router.post("/getLocation", getLocation);

export default router