import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { authorizeRoles } from '../middlewares/AuthMiddleware.js';

const productRoutes = express.Router();

productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);
productRoutes.post('/', 
    authorizeRoles(['admin', 'seller']),
    productController.createProduct);
productRoutes.put('/:id', 
    authorizeRoles(['admin', 'seller']),
    productController.updateProduct);
productRoutes.delete('/:id', 
    authorizeRoles(['admin', 'seller']),
    productController.deleteProduct);

export default productRoutes;
