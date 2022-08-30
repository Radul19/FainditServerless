import serverlessHttp from 'serverless-http';

import { app } from './app';
// const app = require("./app.js")

export const handler = serverlessHttp(app);
