import express from 'express';
import dbClient from "./config/dbClient.js"
import passport from '../src/presentationLayer/middlewares/AuthMiddleware.js';
import { router } from './presentationLayer/routes/index.routes.js';
import { API_PREFIX } from './utils/constants.js';
import { envs } from './config/environments/environments.js';
import cors from 'cors';
import { AppError } from './businessLogicLayer/errors/error.js';
import { globalErrorHandler } from './utils/globalErrorHandler.js';


const app = express();

app.use(cors({
    origin: envs.CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE','PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(passport.initialize());
app.use(API_PREFIX, router);

app.use((req, res, next) => {
    const originalUrl = typeof req.originalUrl === 'string' ? req.originalUrl : '[URL no válida]';
    console.log('[404 Handler] URL recibida:', originalUrl);
    return next(new AppError(404,`${originalUrl} not found!`));
});
  
app.use(globalErrorHandler);

export default app;
