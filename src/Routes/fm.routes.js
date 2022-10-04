import { Router } from "express";

import fmFunctions from "../Controllers/faindit_market";

const router = Router();



const { denunciate, addFavorites, editArticle, findFmiItem, createAnArticle, getAllFmItems, getAllFmFavItems ,getAllMyFmItems} = fmFunctions

//// FAINDIT MARKET ROUTES

// report an item on the marketplaces
router.post('/denunciate', denunciate);
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

export default router
