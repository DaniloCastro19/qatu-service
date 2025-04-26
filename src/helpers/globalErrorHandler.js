import { envs } from '../config/environments/environments.js'
import { AppError } from '../businessLogicLayer/errors/error.js';
import { LogErrorUseCase } from '../businessLogicLayer/errors/errors.log.js';

const logErrorUseCase = new LogErrorUseCase();

const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate value for '${field}'. Please use another value`,
    400
  );
};

const handleValidationError = () => new AppError('Invalid input data', 400);

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = async (err, res) => {
  const errorData = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };

  console.log('Logging error to DB:', errorData);
  await logErrorUseCase.execute(errorData);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (envs.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (envs.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.code === 11000) error = handleDuplicateError();
    if (error.name === 'ValidationError') error = handleValidationError();

    sendErrorProd(error, res);
  }
};
