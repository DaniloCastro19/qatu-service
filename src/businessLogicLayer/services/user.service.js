import userRepository from '../dataAccessLayer/repositories/user.repository.js';

const getAllUsers = async () => {
  return await userRepository.getAll();
};

const getUserById = async (id) => {
  return await userRepository.getById(id);
};

const createUser = async (userData) => {
  return await userRepository.create(userData);
};

const updateUser = async (id, userData) => {
  return await userRepository.update(id, userData);
};

const deleteUser = async (id) => {
  return await userRepository.remove(id);
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
