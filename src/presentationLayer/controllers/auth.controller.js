import { loginService, logoutService, refreshTokenService } from "../../businessLogicLayer/authentication/auth.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
import { authValidators } from './../../businessLogicLayer/authentication/auth.validators.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';
import { envs } from '../../config/environments/environments.js';


export const authenticationController = {
  login: [
    ...authValidators.login,
    catchAsync(async (req, res, next) => {
      const { email, password } = req.body;
      const result = await loginService.execute(email, password);
      
      if (!result) {
        return next(new AppError(401, 'Invalid credentials',));
      }
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          token: result.token,
          expiresIn: envs.SESSION_INACTIVITY_TIMEOUT,
          user: {
            id: result.user._id,
            email: result.user.email,
            role: result.user.role
          }
        }
      });
    })
  ],

  logout: catchAsync(async (req, res, next) => {
    const result = await logoutService.execute(req.user.id);
    if (!result) return next(new AppError(500, 'Logout failed'));
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
      data: {
        logoutTime: new Date().toISOString()
      }
    });
  }),
  
  refreshToken: catchAsync(async (req, res, next) => {
    const newToken = await refreshTokenService.execute(req.user);
    if (!newToken) return next(new AppError(401, 'Invalid token or session expired'));
    res.status(200).json({
      status: 'success',
      data:{
        token: newToken,
        message: 'Token refreshed',
        expiresIn: envs.SESSION_INACTIVITY_TIMEOUT
      }
    });
  })
};
