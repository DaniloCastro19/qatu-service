import express from 'express';

import expressListRoutes from 'express-list-routes';






const app = express();
app.use(express.json());


expressListRoutes(app);



export default app;
