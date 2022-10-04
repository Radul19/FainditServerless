import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const { promiseTest, getImages,applySearch } = generalFunctions

router.post("/testPromise", promiseTest);
router.post("/getImages", getImages);
router.post("/applySearch", applySearch);

export default router