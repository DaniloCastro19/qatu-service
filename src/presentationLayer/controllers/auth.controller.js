import { loginService, logoutService, refreshTokenService } from "../../businessLogicLayer/authentication/auth.service.js";
import { catchAsync } from "../../businessLogicLayer/errors/catchAsync.js";
catchAsync

export const authenticationController = {
  login: catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    const result = await loginService.execute(username, password);
    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  }),
  
  logout: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    await logoutService.execute(userId);
    res.status(200).json({
      message: 'Logged out successfully'
    });
  }),
  
  refreshToken: catchAsync(async (req, res, next) => {
    const newToken = await refreshTokenService.execute(req.user);
    if (!newToken) {
      return res.status(401).json({
        message: 'Invalid token or session expired'
      });
    }

    res.status(200).json({
      message: 'Token refreshed',
      token: newToken
    });
  })
};