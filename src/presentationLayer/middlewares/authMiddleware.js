import passport from "passport";
import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { envs } from "../../config/environments/environments.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: envs.JWT_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await userRepository.getUserById(jwtPayload.id);

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const invalidatedBefore = user.invalidateBefore || new Date(0);
    const tokenCreatedAt = new Date(jwtPayload.iat * 1000);

    if (tokenCreatedAt < invalidatedBefore) {
      return done(null, false, { 
        message: 'Token invalidated due to inactivity',
        autoLogout: true
      });
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in JWT strategy:', error);
    return done(error, false);
  }
});

passport.use(strategy);

export const authorizeRoles = (allowedRoles) => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ 
        status: 'fail',
        message: info?.message || 'Unauthorized',
        ...(info?.autoLogout && { autoLogout: true })
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        status: 'fail',
        message: 'Forbidden: Insufficient permissions' 
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default passport;