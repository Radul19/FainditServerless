import { Router } from "express";

import executiveFunctions from "../Controllers/executive_mode";

const router = Router();

const { createMarket, getAllMarkets, getMarket, addVacant, deleteVacant, myExecutiveModes, registerExecutiveMode, addItem, editItem, deleteItem, addComment, addReply, editComment, editReply, deleteComment } = executiveFunctions;

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


export default router