import { inactivityService } from '../services/inactivity.service.js';

export const inactivityMiddleware = async (req, res, next) => {
try {
    if (!req.user) return next();
    
    const { remainingTime, isExpired } = await inactivityService.checkInactivity(req.user.id);
    
    if (isExpired) {
        await inactivityService.handleExpiredSession(req.user.id);
        throw { 
        name: 'InactivityError',
        message: 'Sesión cerrada por inactividad',
        autoLogout: true
    };
    }
    req.sessionInfo = {
        remainingTime: Math.floor(remainingTime / 1000),
        expiresAt: new Date(Date.now() + remainingTime)
    };

    next();
} catch (error) {
    next(error);
}
};