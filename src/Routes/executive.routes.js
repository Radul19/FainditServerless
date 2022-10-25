import { Router } from "express";

import executiveFunctions from "../Controllers/executive_mode";

const router = Router();

const { createMarket, getAllMarkets, getMarket, addVacant, deleteVacant } = executiveFunctions;

//// MARKET ROUTES
router.post("/createMarket", createMarket);
router.get("/getAllMarkets", getAllMarkets);
router.get("/getMarket/:id", getMarket);


router.post("/addVacant", addVacant);

router.post("/deleteVacant", deleteVacant);



export default router