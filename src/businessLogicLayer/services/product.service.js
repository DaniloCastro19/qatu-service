    import { productRepository } from "../../dataAccessLayer/repositories/product.repository.js";


    export const productService = {
    async getAllProducts() {
        return await productRepository.getAllProducts();
    },

    async getProductById(id) {
        return await productRepository.getProductById(id);
    },

    async createProduct(data) {
        return await productRepository.createProduct(data);
    },

    async updateProduct(id, data) {
        return await productRepository.updateProduct(id, data);
    },

    async patchProduct(id, data) {
        return await productRepository.patchProduct(id, data);
    },

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    },

    async filterProducts(filters = {}) {
        const allProducts = await this.getAllProducts();
        return allProducts.filter(product => {
        return applyCategoryFilter(product, filters.category) && 
                applyPriceFilter(product, filters.minPrice, filters.maxPrice);
        });
    }
    };

    const isValidString = (value) => {
        if (typeof value !== 'string') return false;
        if (value.trim() === '') return false;
        return true;
    };
    
    const isValidNumber = (value) => {
        if (value === undefined) return false;
        const number = Number(value);
        if (isNaN(number)) return false;
        return true;
    };
    
    const createPriceComparator = (type) => (value) => {
        if (!isValidNumber(value)) return null;
        return { [type]: Number(value) };
    };
    
    const createMinPriceFilter = createPriceComparator('$gte');
    const createMaxPriceFilter = createPriceComparator('$lte');
    
    const applyCategoryFilter = (product, category) => {
        if (!category) return true;
        if (!isValidString(category)) return true;
        return product.category === category.trim();
    };
    
    const applyPriceFilter = (product, minPrice, maxPrice) => {
        const minFilter = createMinPriceFilter(minPrice);
        const maxFilter = createMaxPriceFilter(maxPrice);
    
        if (minFilter && product.price < minFilter.$gte) return false;
        if (maxFilter && product.price > maxFilter.$lte) return false;
        return true;
    };