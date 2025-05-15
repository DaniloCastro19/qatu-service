import express from 'express';
import { sellerApplicationController } from '../controllers/sellerAppl.controller.js';
import { authorizeRoles } from '../middlewares/AuthMiddleware.js';

const applicationRoutes = express.Router();

applicationRoutes.get(
    '/',
    authorizeRoles(['admin']),
    sellerApplicationController.getAllApplications
);

applicationRoutes.post(
    '/', 
    authorizeRoles(['admin']),
    sellerApplicationController.createApplication
);

applicationRoutes.put(
    '/:id', 
    authorizeRoles(['admin']),
    sellerApplicationController.updateApplication
);

applicationRoutes.delete(
    '/:id', 
    authorizeRoles(['admin']),
    sellerApplicationController.deleteApplication
);

export default applicationRoutes;
