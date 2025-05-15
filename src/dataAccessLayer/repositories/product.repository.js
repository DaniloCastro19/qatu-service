import Product from '../models/product.model.js';

export const productRepository = {

    async getAllProducts(page, limit, sortField, sortOrder, filters={}) {
      const skip = (page - 1) * limit;
      const filters = filterQuery(filters);
      return await Product.find(request)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
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

  const filterQuery =(filters={}) =>{
      const request ={};
        if(filters.category){
          request.category = filters.category;
        }
        if(filters.minPrice || filters.maxPrice){
          request.price= {};
            if(filters.minPrice)request.price.$gte = Number(filters.minPrice);
            if(filters.maxPrice)request.price.$lte = Number(filters.maxPrice)
        }
      return request;
};