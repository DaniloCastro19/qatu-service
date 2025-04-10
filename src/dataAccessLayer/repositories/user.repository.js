import User from '../models/user.model.js';

// Query perform template
export const getAll = async () => {
    return await User.find(); 
}
