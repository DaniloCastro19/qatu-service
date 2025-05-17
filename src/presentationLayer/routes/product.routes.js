import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { authorizeRoles } from '../middlewares/authMiddleware.js';

const productRoutes = express.Router();


const protectedRoute = [
    authorizeRoles(['admin', 'seller', 'customer'])
];

productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', ...protectedRoute, productController.createProduct);
productRoutes.put('/:id', ...protectedRoute,productController.updateProduct);
productRoutes.delete('/:id', ...protectedRoute,productController.deleteProduct);

export default productRoutes;
