import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { authorizeRoles } from '../middlewares/authMiddleware.js';
import { inactivityMiddleware } from '../middlewares/inactivity.middleware.js';
import passport from 'passport';

const productRoutes = express.Router();


const protectedRoute = [
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(['admin', 'seller', 'customer']),
    inactivityMiddleware
];

productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', ...protectedRoute, productController.createProduct);
productRoutes.put('/:id', ...protectedRoute,productController.updateProduct);
productRoutes.delete('/:id', ...protectedRoute,productController.deleteProduct);

export default productRoutes;
