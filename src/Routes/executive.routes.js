import { Router } from "express";

import executiveFunctions from "../Controllers/executive_mode";

const router = Router();

const { createMarket, getAllMarkets, getMarket, addVacant, deleteVacant, myExecutiveModes, registerExecutiveMode, addItem, editItem, deleteItem, addComment, addReply, editComment, editReply, deleteComment, deleteReply, addExecutiveAdmin, deleteExecutiveAdmin, getAdmins, editExecutiveMode, addMarketFav, myMarketsFav, verifyExecutiveMode, approveExecutive, denyExecutive } = executiveFunctions;

//// MARKET ROUTES
router.post("/createMarket", createMarket);
router.get("/getAllMarkets", getAllMarkets);
router.get("/getMarket/:id", getMarket);

// add vacant
router.post("/addVacant", addVacant);
// delete vacant
router.post("/deleteVacant", deleteVacant);
// executives modes by user
router.post("/myExecutiveModes", myExecutiveModes);
// register a executive mode
router.post("/registerExecutiveMode", registerExecutiveMode);
// add item
router.post("/addItem", addItem);
// edit item
router.post("/editItem", editItem);
// delete item
router.post("/deleteItem", deleteItem);
//add Comment
router.post("/addComment", addComment);
//add Reply
router.post("/addReply", addReply);
//edit Comment
router.post("/editComment", editComment);
//edit Reply
router.post("/editReply", editReply);
//deleteComment
router.post("/deleteComment", deleteComment);
//deleteReply
router.post("/deleteReply", deleteReply);
//addExecutiveAdmin
router.post("/addExecutiveAdmin", addExecutiveAdmin);
//deleteExecutiveAdmin
router.post("/deleteExecutiveAdmin", deleteExecutiveAdmin);
// get my admins
router.post("/getAdmins", getAdmins);
// edit Executive Mode
router.post("/editExecutiveMode", editExecutiveMode);
// add Market Fav
router.post("/addMarketFav", addMarketFav);
// my Markets Fav
router.get("/myMarketsFav/:id", myMarketsFav);
// verify Executive Mode
router.post("/verifyExecutiveMode", verifyExecutiveMode);
// approve Executive
router.post("/approveExecutive", approveExecutive);
//deny Executive
router.post("/denyExecutive", denyExecutive);

export default router