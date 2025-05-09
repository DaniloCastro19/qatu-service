import Product from '../models/product.model.js';

export const productRepository = {

    async getAllProducts(page, limit) {
      const options = {
        page:page,
        limit:limit
      }
      return Product.paginate({},options);
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

    async patchProduct(id, data) {
      const productToPatch = Product.findById(id);
      return Product.findByIdAndUpdate(id, {...productToPatch, ...data}, { new: true });
    },
  
    async deleteProduct(id) {
      return Product.findByIdAndDelete(id);
    }
  };