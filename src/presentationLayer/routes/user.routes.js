import express from 'express';
import { userController } from '../controllers/user.controller.js';

export const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
