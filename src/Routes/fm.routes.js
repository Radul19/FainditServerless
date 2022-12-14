import { Router } from "express";

import fmFunctions from "../Controllers/faindit_market";

const router = Router();



const { denunciate, addFavorites, editArticle, findFmiItem, createAnArticle, getAllFmItems, getAllFmFavItems, getAllMyFmItems, removeItemFm, getContactInfo, fmClickedItem, fmContactedItem, createPromotionFM, approvePromotionFM, denyPromotionFM, filtersPromotionFM } = fmFunctions

//// FAINDIT MARKET ROUTES

// report an item on the marketplaces
router.post('/sendReport', denunciate);
//router for add favorites
router.post('/addFavorites', addFavorites);
//get All Articles /// RENAMED
router.get('/getAllMyFmItems/:id', getAllMyFmItems);
//Edit an article
router.post('/editarticle', editArticle);
//item finder
router.post('/findFmiItem', findFmiItem);
//create An Article
router.post('/createAnArticle', createAnArticle);
//get all all items
router.get('/getAllFmItems', getAllFmItems);
//get All Favourite
router.get('/getAllFmFavItems/:id', getAllFmFavItems);
//remove item the Fm
router.post('/removeItemFm', removeItemFm);
//get contact modal info
router.get('/getContactInfo/:id', getContactInfo);

//remove item the Fm
router.post('/fmClickedItem', fmClickedItem);
//remove item the Fm
router.post('/fmContactedItem', fmContactedItem);
//create Promotion FM
router.post('/createPromotionFM', createPromotionFM);
//Approve Promotion FM
router.post('/approvePromotionFM', approvePromotionFM);
//Deny Promotion FM
router.post('/denyPromotionFM', denyPromotionFM);
//Filters Promotion FM
router.post('/filtersPromotionFM', filtersPromotionFM);
export default router
