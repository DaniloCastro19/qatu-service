import { loginService, logoutService, refreshTokenService } from "../../businessLogicLayer/authentication/auth.service.js";

export const authenticationController = {
    async login(req, res, next) {
      try {
        const { username, password } = req.body;
        const result = await loginService.execute(username, password);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  
    async logout(req, res, next) {
      try {
        const userId = req.user.id;
        await logoutService.execute(userId);
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        next(error);
      }
    },
  
    async refreshToken(req, res, next) {
      try {
        const newToken = await refreshTokenService.execute(req.user);
        res.status(200).json({ token: newToken });
      } catch (error) {
        next(error);
      }
    }
  };