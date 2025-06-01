import { productRepository } from "../../dataAccessLayer/repositories/product.repository.js"
import { orderService } from "./order.service.js";

export const productService = {
    async getAllProducts(page, limit, orderBy, ascending, filters={}) {
        const sortField = orderBy ? 'name' : 'price';
        const sortOrder = ascending ? 1 : -1;

        return await productRepository.getAllProducts(page, limit, sortField, sortOrder, filters);
    },

    async getProductbyId(id) {
        const product = await productRepository.getProductById(id);
        return product;
    },

    async createProduct(data) {
        const product = await productRepository.createProduct(data);
        return product;
    },

    async updateProduct(id, data) {
        const product = await productRepository.updateProduct(id, data);
        return product;
    },

    async patchProduct(id, data) {
        const product = await productRepository.updateProduct(id, data);
        return product;
    },

    async deleteProduct(id) {
        const product = await productRepository.deleteProduct(id);
        return product;
    },
    
    async getComments(productId) {
        return await productRepository.getComments(productId);
    },
        
    async addComment(productId, comment) {
        // User already buy this product?
        const hasPurchased = await orderService.hasUserPurchasedProduct(comment.user, productId);

        if (!hasPurchased) {
            throw new Error('You can only comment on products you have purchased.');
        }
    
        return await productRepository.addComment(productId, comment);
    },
        
    async getRating(productId) {
        return await productRepository.getRating(productId);
    },

    async addRating(productId, userId, ratingValue) {
        //  User already buy this product?
        const hasPurchased = await orderService.hasUserPurchasedProduct(userId, productId);
        if (!hasPurchased) {
            throw new Error('You can only rate products you have purchased.');
        }
    
        return await productRepository.addRating(productId, userId, ratingValue);
    },
    
    async purchaseProduct(productId, userId, quantity) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
    
        // Actualizar el stock del producto
        const product = await productRepository.purchaseProduct(productId, quantity);
    
        // Calcular el precio total
        const totalPrice = product.price * quantity;
    
        console.log(`Total price for ${quantity} of ${product.name}: $${totalPrice}`);
    
        // Crear un nuevo pedido
        const sellerId = product.vendorId; // Asume que el producto tiene un `vendorId`
        const order = await orderService.createOrder(userId, sellerId, productId, quantity, totalPrice);
    
        return order;
    }
};