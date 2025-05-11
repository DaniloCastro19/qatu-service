import { validationResult } from 'express-validator';
import { authValidators } from '../../businessLogicLayer/authentication/auth.validators.js';
import { AppError } from '../../businessLogicLayer/errors/error.js';


export const validateAuthRequest = (validatorType) => {
    if (!authValidators[validatorType]) {
    throw new Error(`Validator type '${validatorType}' not found`);
}

return [
    ...authValidators[validatorType],
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => {
        return err.msg;
        });
        
        return next(new AppError(400, errorMessages.join('; ')));
    }
    next();
        }
    ];
};