import express, { json } from "express";
import helmet from "helmet";
import userRoutes from './Routes/user.routes'
import fmRoutes from './Routes/fm.routes'
import executiveRoutes from './Routes/executive.routes'
import generalSearch from './Routes/general.routes'
import jobRoutes from './Routes/job.routes'
import promotionsRoutes from './Routes/promotions.routes'
// import "./Models/db";

//import { upload } from'./model/upload'
// import uploadFile from './functions/uploadFile';

// ROUTES

const app = express();

app.use(json({ limit: "50mb" }));
app.use(helmet());

// ROUTES
app.use(userRoutes)
app.use(fmRoutes)
app.use(executiveRoutes)
app.use(generalSearch)
app.use(jobRoutes)
app.use(promotionsRoutes)

app.use((_, res, _2) => {
  res.status(404).json({ error: "NOT FOUND" });
});

// eslint-disable-next-line import/prefer-default-export
export { app };
