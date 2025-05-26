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
    },

    async getUserByUsername(name) {
      return await User.findOne({ name });
    },

    async getUserByEmail(email) {
      return await User.findOne({ email });
    },

  async updateInvalidateBefore(id, date) {
    return await User.findByIdAndUpdate(
      id,
      { invalidateBefore: date },
      { new: true }
    );
  },

    async registerAutomaticLogout(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          lastAutomaticLogout: new Date(),
          invalidateBefore: new Date(),
          lastActivity: new Date()
        }
      },
      { new: true }
    ).lean();
  },

  async getLastActivity(userId) {
    const user = await User.findById(userId).select('lastActivity').lean();
    return user?.lastActivity;
  },

  async updateLastActivity(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastActivity: new Date() },
      { new: true }
    ).lean();
  },

  // Verificación de token válido
  async verifyTokenValidity(userId, tokenIssuedAt) {
    const user = await User.findById(userId)
      .select('invalidateBefore')
      .lean();
    
    if (!user) return false;
    
    const tokenDate = new Date(tokenIssuedAt * 1000);
    const invalidatedBefore = user.invalidateBefore || new Date(0);
    
    return tokenDate > invalidatedBefore;
  }
};
