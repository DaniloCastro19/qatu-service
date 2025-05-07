import { userService } from '../../businessLogicLayer/services/user.service.js';
import { catchAsync } from '../../businessLogicLayer/errors/catchAsync.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';

export const userController = {
  getAll: catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ message: 'Users retrieved', data: users });
  }),

  getById: catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError(404, 'User not found'));
    res.status(200).json({ message: 'User retrieved', data: user });
  }),

  
  update: catchAsync(async (req, res, next) => {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return next(new AppError(404, 'User not found'));
    res.status(200).json({ message: 'User updated', data: updatedUser });
  }),

  delete: catchAsync(async (req, res, next) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return next(new AppError(404, 'User not found'));
    res.status(200).json({ message: 'User deleted' });
  })

};
