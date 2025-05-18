import express from 'express';
import { sellerApplicationController } from '../controllers/sellerAppl.controller.js';
import { authorizeRoles } from '../middlewares/authMiddleware.js';

const applicationRoutes = express.Router();

applicationRoutes.get(
    '/',
    authorizeRoles(['admin']),
    sellerApplicationController.getAllApplications
);

applicationRoutes.get(
    '/:id',
    authorizeRoles(['admin']),
    sellerApplicationController.getApplicationsById
);

applicationRoutes.post(
    '/', 
    authorizeRoles(['customer']),
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
