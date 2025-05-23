import { inactivityService } from '../../businessLogicLayer/authentication/auth.service.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';

export const inactivityMiddleware = async (req, res, next) => {
try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();
    
    const sessionInfo = await inactivityService.execute(token);
    req.sessionInfo = sessionInfo;
    next();
} catch (error) {
    if (error.name === 'InactivityError') {
        return next(new AppError(401, error.message, { autoLogout: true }));
    }
    if (error.name === 'TokenExpiredError') {
        return next(new AppError(401, 'Token expired', { autoLogout: true }));
    }
    next(error);
}
};