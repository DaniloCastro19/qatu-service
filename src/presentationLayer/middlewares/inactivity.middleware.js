import jwt from 'jsonwebtoken';
import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';
import { envs } from '../../config/environments/environments.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';

export const inactivityMiddleware = async (req, res, next) => {
try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    const decoded = jwt.verify(token, envs.JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    
    const expirationTime = decoded.iat + envs.SESSION_INACTIVITY_TIMEOUT;

    req.sessionInfo = {
        remainingTime: Math.max(0, expirationTime - now),
      expiresAt: new Date(expirationTime * 1000)
    };

    if (now > expirationTime) {
        await userRepository.registerAutomaticLogout(decoded.id);
        return next(new AppError(401, 'Session closed due to inactivity', {
            code: 'SESSION_TIMEOUT',
            autoLogout: true
        }));
    }

        await userRepository.updateLastActivity(decoded.id);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
        return next(new AppError(401, 'Token JWT expirado', {
            code: 'TOKEN_EXPIRED',
            autoLogout: true
        }));
        }
    next(error);
}
};