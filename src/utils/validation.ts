import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { RunnableValidationChains } from "express-validator/src/middlewares/schema";
import HTTP_STATUS from "~/constants/httpStatus";
import { APP_MESSAGES } from "~/constants/message";
import { AppError } from "~/models/Error";

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const details = errors.array().map((error: any) => {
      return {
        message: error.msg,
        path: error.path,
        value: error.value
      };
    });
    next(new AppError(APP_MESSAGES.INVALID_REQUEST_PARAMS, HTTP_STATUS.BAD_REQUEST, details));
  };
};
