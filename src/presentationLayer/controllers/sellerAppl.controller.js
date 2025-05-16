import { sellerApplicationService } from "../../businessLogicLayer/services/sellerAppl.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
import { AppError } from '../../businessLogicLayer/errors/error.js';


export const sellerApplicationController = {
    getAllApplications: catchAsync(async (req, res, next) => {
        const {page=1, limit=10} = req.query;
        const applications = await sellerApplicationService.getAllApplication(page,limit);
        
        res.status(200).json({message: 'Applications retrieved', data: applications});
    }),
    getApplicationsById: catchAsync(async (req, res, next) => {
        const application = await sellerApplicationService.getApplicationById(req.params.id);
        if (!application) return next(new AppError(404, 'Application not found'));
        res.status(200).json({message: 'Application retrieved', data: application});
    }),
   createApplication: catchAsync(async (req, res, next) => {
        const application = await sellerApplicationService.createApplication(req.body);
        if (!application) return next(new AppError(400, 'Application creation failed. Please, make sure user exists and it role is "customer".'));
        res.status(201).json({message: 'Application created!', data: application});
        }),

    updateApplication: catchAsync(async (req, res, next) => {
        const updatedApplication = await sellerApplicationService.updateApplication(req.params.id, req.body);
        if (!updatedApplication) return next(new AppError(404, 'Application or user not found'));
        res.status(200).json({message: 'Application and user role updated!', data: updatedApplication});
    }),

    deleteApplication: catchAsync(async(req, res,next) => {
        const deletedApplication = await sellerApplicationService.deleteApplication(req.params.id);
        if (!deletedApplication) return next(new AppError(404, 'Application not found'));
        res.status(200).json({ message: 'Application deleted' });
    })
};
