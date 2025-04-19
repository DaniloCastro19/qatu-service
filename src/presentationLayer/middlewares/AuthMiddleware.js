import passport from "passport";
import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";

import { Strategy as JwtStrategy,ExtractJwt } from "passport-jwt";
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
  
      const invalidatedBefore = new Date(user.invalidateBefore);
      const jwtCreatedAt = new Date(jwtPayload.createdAt);
  
      if (jwtCreatedAt < invalidatedBefore) {
        return done(null, false, { message: 'Token has been invalidated' });
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
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Insufficient permissions' });
      }
  
      req.user = user;
      next();
    })(req, res, next);
  };
  

  export default passport;
