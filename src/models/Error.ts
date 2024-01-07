import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';

interface ErrorOptions {
  serverCode: number;
  details?: any;
  stack?: string;
}
export class AppError extends Error {
  status: string;
  statusCode: number = 500;
  isOperational: boolean;
  options: ErrorOptions;
  constructor(statusCode: number, message: string, options: ErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(info?: { message: string; details?: any }) {
    return new AppError(HttpStatus.NOT_FOUND, info?.message || APP_MESSAGES.NotFound, {
      serverCode: ServerCodes.CommomCode.NotFound,
      details: info?.details,
    });
  }

  static badRequest(serverCode: number, message: string, details?: any) {
    return new AppError(HttpStatus.BAD_REQUEST, message, {
      serverCode: serverCode,
      details,
    });
  }

  static queryFailed(details?: any) {
    return new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.QueryFailed, {
      serverCode: ServerCodes.CommomCode.QueryFailed,
      details,
    });
  }

  // Forbiden
  static forbiden(details?: any) {
    return new AppError(HttpStatus.FORBIDDEN, APP_MESSAGES.Forbiden, {
      serverCode: ServerCodes.CommomCode.Forbiden,
      details,
    });
  }

  // Internal Server Error
  static internalServerError(details?: any) {
    return new AppError(HttpStatus.INTERNAL_SERVER_ERROR, APP_MESSAGES.InternalServerError, {
      serverCode: ServerCodes.CommomCode.InternalServerError,
      details,
    });
  }

  static unauthorized(details?: any) {
    return new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.Unauthorized, {
      serverCode: ServerCodes.CommomCode.Unauthorized,
      details,
    });
  }
}
