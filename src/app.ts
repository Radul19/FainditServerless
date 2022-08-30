import express, { json } from 'express';
import helmet from 'helmet';


// import uploadFile from './functions/uploadFile';
import ctrl from './functions/controllers';
import './db/db';
// import cors from 'cors'
const app = express();

app.use(json({ limit: '50mb' }));
app.use(helmet());


// app.use(function (_, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// /// Permitir CORS (Cross-origin resource sharing) que permite recibir peticiones desde otra app o desde el front
// app.use(cors())

// app.use(express.urlencoded({ extended: true }));

/// / ROUTES

const { apitest,  registerUser ,searchEmail,verifyEmailCode,editInterest,login} = ctrl;

app.get('/', apitest);

// app.get('/get', getImage);

// app.post('/upload', uploadImage);

app.post('/registerUser', registerUser);
app.get('/searchEmail/:email', searchEmail);
app.post('/verifyEmailCode', verifyEmailCode);
app.post('/editInterest', editInterest);
app.post('/login', login);

app.use((_, res, _2) => {
  res.status(404).json({ error: 'NOT FOUND' });
});

// eslint-disable-next-line import/prefer-default-export
export { app };
