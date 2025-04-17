import express from 'express';

import expressListRoutes from 'express-list-routes';

import userRoutes from './presentationLayer/routes/user.routes.js';

import { API_PREFIX } from './utils/constants.js';






const app = express();
app.use(express.json());
app.use(`/${API_PREFIX}/users`, userRoutes);


expressListRoutes(app);



export default app;
