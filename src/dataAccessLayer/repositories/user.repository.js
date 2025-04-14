import User from '../models/user.model.js';

export const userRepository = {
    async getAllUsers() {
      return User.find();
    },
  
    async getUserById(id) {
      return User.findById(id);
    },
  
    async createUser(data) {
      const user = new User(data);
      return user.save();
    },
  
    async updateUser(id, data) {
      return User.findByIdAndUpdate(id, data, { new: true });
    },
  
    async deleteUser(id) {
      return User.findByIdAndDelete(id);
    }
  };