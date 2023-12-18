interface ResponseOptions {
  details?: any;
  code?: number;
}
export class AppError extends Error {
  status: string;
  statusCode: number = 500;
  isOperational: boolean;
  options?: ResponseOptions;

  constructor(message: string, statusCode: number, options?: ResponseOptions) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }
}
