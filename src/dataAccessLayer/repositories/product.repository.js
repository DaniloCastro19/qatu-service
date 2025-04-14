import Product from '../models/product.model.js';

export const productRepository = {
    async getAllProducts() {
      return Product.find();
    },
  
    async getProductById(id) {
      return Product.findById(id);
    },
  
    async createProduct(data) {
      const product = new Product(data);
      return product.save();
    },
  
    async updateProduct(id, data) {
      return Product.findByIdAndUpdate(id, data, { new: true });
    },
  
    async deleteProduct(id) {
      return Product.findByIdAndDelete(id);
    }
  };