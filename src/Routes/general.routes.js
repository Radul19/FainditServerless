import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const {
  promiseTest,
  getImages,
  applySearch,
  getLocation,
  searchItem,
  searchMarket
} = generalFunctions

router.post("/testPromise", promiseTest);
router.post("/getImages", getImages);
router.post("/applySearch", applySearch);
router.post("/getLocation", getLocation);

router.post("/searchItem", searchItem);
router.post("/searchMarket", searchMarket);


export default router