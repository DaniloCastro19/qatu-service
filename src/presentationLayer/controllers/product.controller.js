import { productService } from "../../businessLogicLayer/services/product.service.js";

export const productController = {
    async getAllProducts(req, res, next) {
        try {
            const products = await productService.getAllUsers();

            res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    },


    async getProductById(req, res, next) {
        try {
          const product = await productService.getProductbyId(req.params.id);
          if (!product) return res.status(404).json({ message: 'Product not found' });
          res.status(200).json(product);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    },

      async createProduct(req, res, next) {
        try {
          const product = await productService.createProduct(req.body);
          res.status(201).json(product);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },

      async updateProduct(req, res, next) {
        try {
          const updatedProduct = await productService.updateProduct(req.params.id, req.body);
          if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
          res.status(200).json(updatedProduct);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },
    
      async deleteProduct(req, res) {
        try {
          const deletedProduct = await productService.deleteProduct(req.params.id);
          if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
          res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    }
};