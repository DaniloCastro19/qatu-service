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

  export default passport;
