import express from 'express';
import { authenticationController } from '../controllers/auth.controller.js';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authMiddleware.js';
import { validateAuthRequest } from '../middlewares/validation.middleware.js';
import { inactivityMiddleware } from '../middlewares/inactivity.middleware.js';


export const router = express.Router();


const protectedRoute = [
  passport.authenticate('jwt', { session: false }),
  authorizeRoles(['admin', 'seller', 'customer']),
  inactivityMiddleware
];


router.post('/login', validateAuthRequest('login'), authenticationController.login);
router.post('/logout', ...protectedRoute, authenticationController.logout);
router.post('/refresh-token', ...protectedRoute, authenticationController.refreshToken);

router.get('/session-time',passport.authenticate('jwt', { session: false }), inactivityMiddleware, authenticationController.getSessionTime
);

export default router;
