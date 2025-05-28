import { body } from 'express-validator';

export const authValidators = {
login: [
        body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 50 }).withMessage('Maximum 50 characters'),
        
        body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Minimum 8 characters')
    ],

register: [
        body('name')
            .trim()
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
            .isAlphanumeric('en-US', { ignore: '_-' }).withMessage('Username can only contain letters, numbers, underscores and hyphens')
            .custom(value => /^[a-zA-Z]/.test(value)).withMessage('Username must start with a letter')
            .custom(value => !/^\d+$/.test(value)).withMessage('Username cannot be numbers only')
            .custom(value => !/^[^a-zA-Z0-9]+$/.test(value)).withMessage('Username cannot be special characters only'),
            
            body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .isLength({ max: 50 }).withMessage('Email must be maximum 50 characters'),
            
            body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)'),
        
            body('role')
            .optional()
            .isIn(['admin', 'seller', 'customer']).withMessage('Invalid role. Must be one of: admin, seller, customer')
        ]
    };
