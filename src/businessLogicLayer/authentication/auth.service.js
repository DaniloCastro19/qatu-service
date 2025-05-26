import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";
import jwtService from "./jwt.service.js";
import { envs } from '../../config/environments/environments.js';
import jwt from 'jsonwebtoken';


export const loginService = {
  async execute(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user || !(await jwtService.verifyPassword(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwtService.generateToken(user);
    await userRepository.updateLastActivity(user.id);
    return { 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
}
};


export const logoutService = {
  async execute(userId) {
    const userLogout = await userRepository.updateInvalidateBefore(userId, new Date());
    return userLogout;

  }
};

export const refreshTokenService = {
  async execute(user) {
    const newToken = jwtService.generateToken(user);
    return newToken;
  }
};


export const inactivityService = {
  userLastActivity: new Map(),

  async checkAndHandleInactivity(userId, token) {
    const now = Date.now();
    const lastActivity = this.userLastActivity.get(userId) || now;
    const timeout = envs.SESSION_INACTIVITY_TIMEOUT * 1000; 
    if ((now - lastActivity) > timeout) {
      await this.forceLogout(userId);
            try {
        jwt.verify(token, envs.JWT_SECRET);
        throw {
          name: 'InactivityError',
          message: 'Sesión cerrada por inactividad',
          autoLogout: true
        };
      } catch (err) {
        throw err;
      }
    }
    this.userLastActivity.set(userId, now);
    return {
      remainingTime: timeout - (now - lastActivity),
      expiresAt: new Date(now + (timeout - (now - lastActivity)))
    };
  },

  async forceLogout(userId) {
    this.userLastActivity.delete(userId);
    await userRepository.registerAutomaticLogout(userId);
  }
};