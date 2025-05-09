import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { validateAuthRequest } from '../middlewares/validation.middleware.js';

export const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/register', validateAuthRequest('register'), userController.register);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
