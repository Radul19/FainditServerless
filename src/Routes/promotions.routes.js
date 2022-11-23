import { Router } from "express";
import  promotionsFunctions  from "../Controllers/promotions.js"
const router = Router();


const { createPromotion } = promotionsFunctions;


//create Promotion
router.post('/createPromotion', createPromotion);

export default router