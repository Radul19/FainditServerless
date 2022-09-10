import express, { json } from 'express';
import helmet from 'helmet';


// import uploadFile from './functions/uploadFile';
import ctrl from './functions/controllers';
import './db/db';
// import cors from 'cors'
const app = express();

app.use(json({ limit: '50mb' }));
app.use(helmet());


const { apitest,  registerUser ,searchEmail,verifyEmailCode,editInterest,login,getProfilePicture,updateProfilePicture,forgotPasswordSend,forgotPasswordCode} = ctrl;

app.get('/', apitest);

app.post('/registerUser', registerUser);
app.get('/searchEmail/:email', searchEmail);
app.post('/verifyEmailCode', verifyEmailCode);
app.post('/editInterest', editInterest);
app.post('/login', login);
app.get('/getProfilePicture/:name', getProfilePicture);
app.post('/updateProfilePicture', updateProfilePicture);
// app.post('/uploadImage', uploadImage);
app.post('/forgotPasswordSend', forgotPasswordSend);
app.post('/forgotPasswordCode', forgotPasswordCode);




app.use((_, res, _2) => {
  res.status(404).json({ error: 'NOT FOUND' });
});

// eslint-disable-next-line import/prefer-default-export
export { app };
