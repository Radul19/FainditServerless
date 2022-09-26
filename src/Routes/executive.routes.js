import { Router } from "express";

import executiveFunctions from "../Controllers/executive_mode";

const router = Router();

const { createMarket, getAllMarkets, getMarket } = executiveFunctions;

//// MARKET ROUTES
router.post("/createMarket", createMarket);
router.get("/getAllMarkets", getAllMarkets);
router.get("/getMarket/:id", getMarket);


export default router