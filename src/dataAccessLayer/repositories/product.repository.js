import Product from '../models/product.model.js';

export const productRepository = {

    async getAllProducts(page, limit, sortField, sortOrder, filters={}) {
      const skip = (page - 1) * limit;
      const searchtoFilter = filterQuery(filters);
      return await Product.find(searchtoFilter)
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
    },

    async addComment(productId, comment) {
      return Product.findByIdAndUpdate(
        productId,
        { $push: { comments: comment } },
        { new: true }
      );
    },
  
    async getComments(productId) {
      return Product.findById(productId).select('comments');
    },
  
    async addRating(productId, userId, ratingValue) {
      console.log(userId);
      const product = await Product.findById(productId);
      if (!product) return null;
  
      if (!Array.isArray(product.ratings)) {
          product.ratings = [];
      }
  
      const existingRating = product.ratings.find(r => r.user.toString() === userId);
      if (existingRating) {
          existingRating.value = ratingValue;
      } else {
          product.ratings.push({ user: userId, value: ratingValue });
      }
  
      const total = product.ratings.reduce((acc, r) => acc + r.value, 0);
      product.rating = total / product.ratings.length;
  
      return product.save();
  },
  
    async getRating(productId) {
      return Product.findById(productId).select('rating');
    },

    async purchaseProduct(productId, quantity) {
      const product = await Product.findById(productId);
      if (!product) return null;
  
      if (product.amount < quantity) {
          throw new Error('Insufficient stock');
      }
  
      product.amount -= quantity;
      return product.save();
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