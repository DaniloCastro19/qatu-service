import { userService } from '../../businessLogicLayer/services/user.service.js';
import { catchAsync } from '../../businessLogicLayer/errors/catchAsync.js';
export const userController = {
  getAll: catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ message: 'Users retrieved', data: users });
  }),

  getById: catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User retrieved', data: user });
  }),

  create: catchAsync(async (req, res, next) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created', data: newUser });
  }),

  update: catchAsync(async (req, res, next) => {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', data: updatedUser });
  }),

  delete: catchAsync(async (req, res, next) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  })

};
