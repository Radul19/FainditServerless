import { Router } from "express";

import generalFunctions from "../Controllers/general_search";

const router = Router();

const {
  promiseTest,
  getImages,
  applySearch,
  getLocation,
  getItemReviews,
  searchItems,
  searchMarket,
  toggleFavorite
} = generalFunctions

router.post("/testPromise", promiseTest);
router.post("/getImages", getImages);
router.post("/applySearch", applySearch);
router.post("/getLocation", getLocation);

/// search multiple items
router.post("/searchItems", searchItems);
/// get item reviews by ID
router.get("/getItemReviews/:id", getItemReviews);
router.post("/searchMarket", searchMarket);
router.post("/toggleFavorite", toggleFavorite);


export default router