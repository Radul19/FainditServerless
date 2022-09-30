import { Router } from "express";

import fmFunctions from "../Controllers/faindit_market";

const router = Router();



const { denunciate , addFavorites, getAllArticles ,editArticle ,findFmiItem, createAnArticle, getAllFmItems }  = fmFunctions

//// FAINDIT MARKET ROUTES

//report an item on the marketplaces
router.post('/denunciate',denunciate);
//router for add favorites
router.post('/addFavorites',addFavorites);
//get All Articles
router.get('/:ownerId/id',getAllArticles);
//Edit an article
router.post('/editarticle',editArticle);
//item finder
router.post('/findFmiItem',findFmiItem);
//create An Article
router.post('/createAnArticle',createAnArticle);
//get all all items
router.get('/getAllFmItems',getAllFmItems);
export default router