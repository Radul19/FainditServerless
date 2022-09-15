import express, { json } from 'express';
import helmet from 'helmet';
//import { upload } from'./model/upload'

// import uploadFile from './functions/uploadFile';
import ctrl from './functions/controllers';
import './db/db';
// import cors from 'cors'

const app = express();

app.use(json({ limit: '50mb' }));
app.use(helmet());


const { apitest, registerUser ,searchEmail,verifyEmailCode,editInterest,login,getProfilePicture,updateProfilePicture,saveImage,denunciate,addFavorites } = ctrl;

app.get('/', apitest);

app.post('/registerUser', registerUser);
app.get('/searchEmail/:email', searchEmail);
app.post('/verifyEmailCode', verifyEmailCode);
app.post('/editInterest', editInterest);
app.post('/login', login);
app.get('/getProfilePicture/:name', getProfilePicture);
app.post('/updateProfilePicture', updateProfilePicture);
// routers to upload an image to s3 and save it
app.post('/updateImage',saveImage);
//report an item on the marketplaces
app.post('/denunciate',denunciate);
//router for add favorites
app.post('/addFavorites',addFavorites);

app.use((_, res, _2) => {
  res.status(404).json({ error: 'NOT FOUND' });
});

// eslint-disable-next-line import/prefer-default-export
export { app };
