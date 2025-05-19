import { productService } from "../../businessLogicLayer/services/product.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
import { AppError } from '../../businessLogicLayer/errors/error.js';


export const productController = {
    getAllProducts: catchAsync(async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orderBy = req.query.orderBy === 'true';   // true = name, false = price
    const ascending = req.query.ascending === 'true'; // true = asc, false = desc
    
    const filters ={
        category: req.query.category,
        minPrice: req.query.minPrice ?Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice? Number(req.query.maxPrice): undefined
    };

    const products = await productService.getAllProducts(page, limit, orderBy, ascending, filters);
    res.status(200).json({ message: 'Products retrieved', data: products });
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

    getComments: catchAsync(async (req, res, next) => {
        const comments = await productService.getComments(req.params.id);
        if (!comments) return next(new AppError(404, 'Product not found'));
        res.status(200).json(comments);
      }),
    
    addComment: catchAsync(async (req, res, next) => {
        const comment = {
            user: req.user.id,
            text: req.body.text
        };
        
        const updated = await productService.addComment(req.params.id, comment);
        if (!updated) return next(new AppError(404, 'Product not found'));
        res.status(200).json({ message: 'Comment added', data: updated });
    }),
    
    getRating: catchAsync(async (req, res, next) => {
        const rating = await productService.getRating(req.params.id);
        if (!rating) return next(new AppError(404, 'Product not found'));
        res.status(200).json(rating);
    }),
    
    addRating: catchAsync(async (req, res, next) => {
        const rating = parseFloat(req.body.rating);
        if (isNaN(rating)) return next(new AppError(400, 'Invalid rating'));
        const updated = await productService.addRating(req.params.id, rating);
        if (!updated) return next(new AppError(404, 'Product not found'));
        res.status(200).json({ message: 'Rating added', data: updated });
    })
};
