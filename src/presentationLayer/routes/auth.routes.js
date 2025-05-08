import express from 'express';
import { authenticationController } from '../controllers/auth.controller.js';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/AuthMiddleware.js';

export const router = express.Router();

router.post('/login', authenticationController.login);
router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['client', 'admin', 'seller', 'customer']),
  authenticationController.logout
);
router.post(
  '/refreshToken',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['client', 'admin', 'admin', 'seller', 'customer']),
  authenticationController.refreshToken
);

export default router;
