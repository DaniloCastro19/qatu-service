import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { validateAuthRequest } from '../middlewares/validation.middleware.js';

import { authorizeRoles } from '../middlewares/authMiddleware.js';
import { inactivityMiddleware } from '../middlewares/inactivity.middleware.js';
import passport from 'passport';

export const router = express.Router();

const protectedRoute = [
    passport.authenticate('jwt', { session: false }),
    authorizeRoles(['admin', 'seller', 'customer']),
    inactivityMiddleware
];

router.get('/', userController.getAll);
router.get('/:id', ...protectedRoute, userController.getById);
router.post('/', validateAuthRequest('register'), userController.register);
router.put('/:id', ...protectedRoute, userController.update);
router.delete('/:id', ...protectedRoute, userController.delete);

export default router;