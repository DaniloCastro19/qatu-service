import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';
import bcrypt from 'bcrypt';


export const userService = {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  },

  async getUserById(id) {
    return await userRepository.getUserById(id);
  },

  async updateUser(id, userData) {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    return await userRepository.updateUser(id, userData);
  },

  async deleteUser(id) {
    return await userRepository.deleteUser(id);
  }
};