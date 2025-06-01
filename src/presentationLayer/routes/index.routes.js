import express from 'express'
import {router as userRouter} from '../routes/user.routes.js'
import {router as authRouter} from '../routes/auth.routes.js'
import applicationRoutes from './sellerAppl.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';

export const router = express.Router();
router.use('/users',userRouter);
router.use('/products', productRoutes);
router.use('/applications',applicationRoutes)
router.use('/auth',authRouter);
router.use('/orders', orderRoutes);
