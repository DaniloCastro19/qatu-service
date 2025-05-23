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
  async execute(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.getUserById(decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    const now = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
    const inactivityTimeout = parseInt(process.env.SESSION_INACTIVITY_TIMEOUT) || 100; // 100 segundos
    const expirationTime = decoded.iat + inactivityTimeout; // Suma correcta

    console.log(`[DEBUG] now: ${now}, iat: ${decoded.iat}, expires: ${expirationTime}`);

    if (now > expirationTime) {
      await userRepository.registerAutomaticLogout(decoded.id);
      throw { 
        name: 'InactivityError',
        message: 'Session expired due to inactivity',
        autoLogout: true
      };
    }

    await userRepository.updateLastActivity(decoded.id);
    return {
      remainingTime: expirationTime - now, // Tiempo restante en segundos
      expiresAt: new Date(expirationTime * 1000) // Conversión a Date correcta
    };
  }
};