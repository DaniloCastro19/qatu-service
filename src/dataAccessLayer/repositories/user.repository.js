import User from '../models/user.model.js';

export const userRepository = {
    async getAllUsers() {
      return await User.find();
    },
  
    async getUserById(id) {
      return await User.findById(id);
    },
  
    async createUser(data) {
      const user = new User(data);
      return await user.save();
    },
  
    async updateUser(id, data) {
      return await User.findByIdAndUpdate(id, data, { new: true });
    },
  
    async deleteUser(id) {
      return await User.findByIdAndDelete(id);
    }
  };

  