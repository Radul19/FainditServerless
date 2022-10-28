import { Router } from "express";

import userFunctions from "../Controllers/user";

const router = Router();


const {
  apitest,
  registerUser,
  searchEmail,
  verifyEmailCode,
  editInterest,
  login,
  getProfilePicture,
  updateProfilePicture,
  forgotPasswordSend,
  forgotPasswordCode,
  verifyIDRequest,
  editUserData,
  getUserData
} = userFunctions;

router.get("/", apitest);

/// USER ROUTES
router.post("/login", login);

router.post("/registerUser", registerUser);
router.get("/searchEmail/:email", searchEmail);
router.post("/verifyEmailCode", verifyEmailCode);
router.post("/editInterest", editInterest);
router.get("/getProfilePicture/:name", getProfilePicture);
router.post("/updateProfilePicture", updateProfilePicture);
router.post("/forgotPasswordSend", forgotPasswordSend);
router.post("/forgotPasswordCode", forgotPasswordCode);
router.post("/verifyIDRequest", verifyIDRequest);
router.post("/editUserData", editUserData);

//// Extra
router.get("/getUserData/:id", getUserData);


export default router