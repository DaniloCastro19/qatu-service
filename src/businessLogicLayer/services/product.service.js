import { productRepository } from "../../dataAccessLayer/repositories/product.repository.js"

export const productService = {
    async getAllProducts(page, limit) {
        const products = await productRepository.getAllProducts(page,limit);
        return products;
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
    async getOrderedProducts(orderBy, ascending) {
        const sortField = orderBy ? 'name' : 'price';
        const sortOrder = ascending ? 1 : -1;

        return await productRepository.getOrderedProducts(sortField, sortOrder);
    }
};