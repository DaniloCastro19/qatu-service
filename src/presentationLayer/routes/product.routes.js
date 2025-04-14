import express from 'express';
import { productController } from '../controllers/product.controller';

const routerProduct = express.Router();

routerProduct.get('/', productController.getAllProducts);
routerProduct.get('/:id', productController.getProductById);
routerProduct.post('/', productController.createProduct);
routerProduct.put('/:id', productController.updateProduct);
routerProduct.delete('/:id', productController.deleteProduct);

export default routerProduct;