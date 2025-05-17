    import { AppError } from '../../businessLogicLayer/errors/error.js';
    import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';

export const checkInactivity = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next();
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        
        if (decoded.iat + decoded.timeout < now) {
        await userRepository.registerAutomaticLogout(decoded.id);
        
        return next(new AppError(401, 'Session closed due to inactivity', {
            autoLogout: true,
            remainingTime: 0
        }));
    }
        // Calculate remaining time for the fronted
        req.sessionTimeout = {
        remaining: (decoded.iat + decoded.timeout) - now
        };      
        next();
    } catch (error) {
        next(error);
    }
};