import { inactivityService } from '../../businessLogicLayer/authentication/auth.service.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';

export const inactivityMiddleware = async (req, res, next) => {
try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !req.user) return next();
    
    const sessionInfo = await inactivityService.checkAndHandleInactivity(req.user.id, token);
    
    req.sessionInfo = {
        remainingTime: Math.floor(sessionInfo.remainingTime / 1000),
        expiresAt: sessionInfo.expiresAt
    };
    
    next();
} catch (error) {
    if (error.name === 'InactivityError') {
        return next(new AppError(401, error.message, {
        code: 'SESSION_TIMEOUT',
        autoLogout: true
    }));
    }
    next(error);
}
};