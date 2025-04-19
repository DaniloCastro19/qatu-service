import express from 'express';
import expressListRoutes from 'express-list-routes';
import dbClient from "./config/dbClient.js"
import passport from '../src/presentationLayer/middlewares/AuthMiddleware.js';
import { router } from './presentationLayer/routes/index.routes.js';
import { API_PREFIX } from './utils/constants.js';

const app = express();
app.use(express.json());
app.use(passport.initialize())
app.use(API_PREFIX,router)

expressListRoutes(app);

export default app;
