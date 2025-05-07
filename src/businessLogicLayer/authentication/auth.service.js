import { userRepository } from "../../dataAccessLayer/repositories/user.repository.js";
import jwtService from "./jwt.service.js";
import bcrypt from 'bcrypt';


export const loginService = {
  async execute(email, password) {
    const user = await userRepository.getUserByEmail(email);
    if (!user || !(await jwtService.verifyPassword(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwtService.generateToken(user);
    return { token, user };
  }
};


export const registerService = {
  async execute(userData) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
    const userToCreate = {
      ...userData,
      password: hashedPassword
    };

    return await userRepository.createUser(userToCreate);
  },

  async getUserByEmail(email) {
      return await userRepository.getUserByEmail(email);
    },

  async getUserByUsername(username) {
      return await userRepository.getUserByUsername(username);
  },
  
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