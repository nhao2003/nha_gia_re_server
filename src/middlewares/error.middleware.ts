import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';
import { AppError } from '~/models/Error';

const handleValidationErrorDB = (err: any) => {
  const details = Object.values(err.errors).map((el: any) => {
    return {
      path: el.path,
      message: el.message,
    };
  });
  return new AppError(APP_MESSAGES.INVALID_INPUT_DATA, 400, {
    details,
  });
};

const handleUserInputError = (error: any): AppError => {
  const keyValue = error.keyValue;
  return new AppError(APP_MESSAGES.EMAIL_ALREADY_EXISTS, 400, keyValue);
};

const handleDevelopmentError = (err: any, res: Response) => {
  console.log(err);
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: err.status,
    error: err,
    code: err?.options?.code,
    message: err.message,
    stack: err.stack,
  } as any);
};

const handleProductionError = (err: any, res: Response) => {
  console.log(err);
  if (err.isOperational !== undefined && err.isOperational) {
    console.log('OPERATIONAL ERROR');
    res.status(err.statusCode).json({
      status: err.status,
      code: err?.options?.code,
      message: err.message,
      details: err.details,
    } as any);
  } else {
    console.log('PROGRAMMING ERROR');
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: APP_MESSAGES.INTERNAL_SERVER_ERROR,
    } as any);
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('PRODUCTION ERROR');
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleUserInputError(error);
    if (error.name === 'JsonWebTokenError') error = new AppError(APP_MESSAGES.INVALID_TOKEN, 401, {
      code: ServerCodes.AuthCode.InvalidCredentials,
    });
    if (error.name === 'TokenExpiredError') error = new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401, {
      code: ServerCodes.AuthCode.TokenIsExpired,
    });
    handleProductionError(error, res);
  } else {
    throw new Error('NODE_ENV is not set');
  }
};
