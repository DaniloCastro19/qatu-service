import express from 'express';
import { authenticationController } from '../controllers/auth.controller.js';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/AuthMiddleware.js';
import { validateAuthRequest } from '../middlewares/validation.middleware.js';


export const router = express.Router();

router.post('/login', validateAuthRequest('login'), authenticationController.login);

router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['customer', 'admin', 'seller']),
  authenticationController.logout
);

router.post(
  '/refreshToken',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['customer', 'admin', 'seller']),
  authenticationController.refreshToken
);

export default router;
