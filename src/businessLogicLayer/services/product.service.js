import { productRepository } from "../../dataAccessLayer/repositories/product.repository.js"

export const productService = {
    async getAllProducts() {
        const products = await productRepository.getAllProducts();
        return products;
    },

    async getProductbyId(id) {
        const product = await productRepository.getProductById();
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
    }
};