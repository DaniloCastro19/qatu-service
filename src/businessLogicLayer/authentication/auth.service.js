import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";
import jwtService from "./jwt.service.js";

export const loginService = {
  async execute(username, password) {
    const user = await userRepository.getUserByUsername(username);
    if (!user || !(await jwtService.verifyPassword(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwtService.generateToken(user);
    return { token, user };
  }
};

export const logoutService = {
  async execute(userId) {
    await userRepository.updateInvalidateBefore(userId, new Date());
  }
};

export const refreshTokenService = {
  async execute(user) {
    const newToken = jwtService.generateToken(user);
    return newToken;
  }
};