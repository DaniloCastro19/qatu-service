import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { envs } from '../../config/environments/environments.js';

export const jwtService = {
  generateToken(user) {
    const payload = {
      id: user._id,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '24h' });
  },
  verifyToken(token) {
    return jwt.verify(token, envs.JWT_SECRET);
  },

  async verifyPassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
};
export default jwtService;