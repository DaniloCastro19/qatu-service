import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { validateAuthRequest } from '../middlewares/validation.middleware.js';
import { authorizeRoles } from '../middlewares/AuthMiddleware.js';

export const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.register);
router.put('/:id', 
    authorizeRoles(['admin', 'seller', 'customer']), // Nice To Have: If a personal profile edit feature is added to the store, this endpoint should be split in two, to only allow a user to update their own info.
    userController.update);
router.delete('/:id', 
    authorizeRoles(['admin']),
    userController.delete);

export default router;
