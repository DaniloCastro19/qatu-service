import express from 'express';

import expressListRoutes from 'express-list-routes';


import productRoutes from './presentationLayer/routes/product.routes.js'





const app = express();
app.use(express.json());
app.use('/products', productRoutes);


expressListRoutes(app);



export default app;
