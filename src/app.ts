import express, { json } from "express";
import helmet from "helmet";
//import { upload } from'./model/upload'

// import uploadFile from './functions/uploadFile';
import userFunctions from "./Controllers/user";
import "./Models/db";
// import cors from 'cors'

const app = express();

app.use(json({ limit: "50mb" }));
app.use(helmet());

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
} = userFunctions;

app.get("/", apitest);

/// USER ROUTES
app.post("/login", login);

app.post("/registerUser", registerUser);
app.get("/searchEmail/:email", searchEmail);
app.post("/verifyEmailCode", verifyEmailCode);
app.post("/editInterest", editInterest);
app.get("/getProfilePicture/:name", getProfilePicture);
app.post("/updateProfilePicture", updateProfilePicture);
app.post("/forgotPasswordSend", forgotPasswordSend);
app.post("/forgotPasswordCode", forgotPasswordCode);
app.post("/verifyIDRequest", verifyIDRequest);
app.post("/editUserData", editUserData);

//// FAINDIT MARKET ROUTES

app.use((_, res, _2) => {
  res.status(404).json({ error: "NOT FOUND" });
});

// eslint-disable-next-line import/prefer-default-export
export { app };
