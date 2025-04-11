import express from 'express';

import expressListRoutes from 'express-list-routes';

import userRoutes from './presentationLayer/routes/user.routes.js';






const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);


expressListRoutes(app);



export default app;
