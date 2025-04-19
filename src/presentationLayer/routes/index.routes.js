import express from 'express'
import {router as userRouter} from '../routes/user.routes.js'
import {router as authRouter} from '../routes/auth.routes.js'

export const router = express.Router();
router.use('/users',userRouter)
router.use('/auth',authRouter)
