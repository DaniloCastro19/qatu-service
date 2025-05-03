import { loginService, logoutService, registerService , refreshTokenService } from "../../businessLogicLayer/authentication/auth.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
import { authValidators } from './../../businessLogicLayer/authentication/auth.validators.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';


export const authenticationController = {
  login: [
    ...authValidators.login,
    catchAsync(async (req, res, next) => {
      const { email, password } = req.body;
      const result = await loginService.execute(email, password);
      if (!result) return next(new AppError(401, 'Invalid credentials'));
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result
      });
    })
  ],


  register: catchAsync(async (req, res, next) => {
    const emailExists = await registerService.getUserByEmail(req.body.email);
    if (emailExists) return next(new AppError(400, 'Email already in use'));
    if (req.body.name) {
      const usernameExists = await registerService.getUserByUsername(req.body.name);
      if (usernameExists) return next(new AppError(400, 'Username already taken'));
    }
      const newUser = await registerService.execute(req.body);
    if (!newUser) return next(new AppError(400, 'Registration failed'));
      res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
}),


  logout: catchAsync(async (req, res, next) => {
    const result = await logoutService.execute(req.user.id);
    if (!result) return next(new AppError(500, 'Logout failed'));
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  }),

  
  refreshToken: catchAsync(async (req, res, next) => {
    const newToken = await refreshTokenService.execute(req.user);
    if (!newToken) return next(new AppError(401, 'Invalid token or session expired'));
    
    res.status(200).json({
      status: 'success',
      message: 'Token refreshed',
      token: newToken
    });
  })
};