import { productService } from "../../businessLogicLayer/services/product.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
import { AppError } from '../../businessLogicLayer/errors/error.js';


export const productController = {
    getAllProducts: catchAsync(async (req, res, next) => {
        const products = await productService.getAllProducts();
        res.status(200).json({message: 'Products retrieved', data: products});
    }),

    getProductById: catchAsync (async (req, res, next) => {
        const product = await productService.getProductbyId(req.params.id);
        if (!product) return next(new AppError(404, 'Product not found'));
        res.status(200).json(product);
    }),

    createProduct: catchAsync(async (req, res, next) => {
        const product = await productService.createProduct(req.body);
        if (!product) return next(new AppError(400, 'Product creation failed'));
        res.status(201).json(product);
        }),

    updateProduct: catchAsync(async (req, res, next) => {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) return next(new AppError(404, 'Product not found'));
        res.status(200).json(updatedProduct);
        }),

    patchProduct: catchAsync(async(req, res, next)=>{
        const updatedProduct = await productService.patchProduct(req.params.id, req.body);
        if (!updatedProduct) return next(new AppError(404, 'Product not found'));
        res.status(200).json(updatedProduct);
    }),
    
    deleteProduct: catchAsync(async(req, res,next) => {
        const deletedProduct = await productService.deleteProduct(req.params.id);
        if (!deletedProduct) return next(new AppError(404, 'Product not found'));
        res.status(200).json({ message: 'Product deleted' });
    }),

    filterProducts: catchAsync(async (req, res, next) => {
        const { category, minPrice, maxPrice } = req.body;
        if (!category && minPrice === undefined && maxPrice === undefined) {
            return next(new AppError(400, 'Should provide at least one search'));
        }
        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            return next(new AppError(400, 'The minimum price cannot be higher than the maximum price'));
        }
        const filters = { category, minPrice, maxPrice };
        const filteredProducts = await productService.filterProducts(filters);
            res.status(200).json({
            status: 'success',
            results: filteredProducts.length,
            data: filteredProducts,
            SearchApply: filters
        });
    })
};