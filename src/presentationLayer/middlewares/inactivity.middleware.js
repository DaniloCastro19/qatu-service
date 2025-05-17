import jwt from 'jsonwebtoken';
import { envs } from '../../../config/environments/environments.js';
import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';

export const inactivityMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next();
        
        const decoded = jwt.verify(token, envs.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);

        // Verificar expiración por inactividad
        if (decoded.iat + envs.SESSION_INACTIVITY_TIMEOUT < now) {
        await userRepository.registerAutomaticLogout(decoded.id);
        return next(new AppError(401, 'Your session has expired due to inactivity', {
            code: 'SESSION_TIMEOUT',
            autoLogout: true,
            redirectUrl: `${envs.CLIENT_URL}/login?session_expired=true`
        }));
        }

        // Actualizar última actividad
        await userRepository.updateLastActivity(decoded.id);
        
        // Agregar información de tiempo restante al request
        req.sessionInfo = {
        remainingTime: (decoded.iat + envs.SESSION_INACTIVITY_TIMEOUT) - now,
        userId: decoded.id
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
        return next(new AppError(401, 'Session expired', {
            code: 'TOKEN_EXPIRED',
            autoLogout: true
        }));
        }
        next(error);
    }
    };