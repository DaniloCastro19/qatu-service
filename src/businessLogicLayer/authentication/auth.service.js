import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";
import jwtService from "./jwt.service.js";
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
  lastActivityMap: new Map(),

  async checkInactivity(userId) {
    const now = Date.now();
    const lastActivity = this.lastActivityMap.get(userId) || now;
    const inactivityTimeout = envs.SESSION_INACTIVITY_TIMEOUT * 1000;

    this.lastActivityMap.set(userId, now);
    return {
      remainingTime: inactivityTimeout - (now - lastActivity),
      isExpired: (now - lastActivity) > inactivityTimeout
    };
  },
  async handleExpiredSession(userId) {
    this.lastActivityMap.delete(userId);
    await userRepository.registerAutomaticLogout(userId);
  }
};