import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';

export const userService = {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  },

  async getUserById(id) {
    return await userRepository.getUserById(id);
  },

  async createUser(userData) {
    return await userRepository.createUser(userData);
  },

  async updateUser(id, userData) {
    return await userRepository.updateUser(id, userData);
  },

  async deleteUser(id) {
    return await userRepository.remove(id);
  }
};