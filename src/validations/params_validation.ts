import { ValidationChain, body } from 'express-validator';
import { DefaultSchemaKeys, ParamSchema, Schema } from 'express-validator/src/middlewares/schema';
import { APP_MESSAGES } from '~/constants/message';
import { User } from '~/domain/databases/entity/User';
import { AppError } from '~/models/Error';

export class ParamsValidation {
  public static email: ParamSchema = {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email is not valid',
    },
    notEmpty: {
      errorMessage: APP_MESSAGES.EMAIL_IS_REQUIRED,
    },
    trim: true,
  };
  public static password: ParamSchema = {
    in: ['body'],
    isLength: {
      errorMessage: APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
      options: { min: 8, max: 32 },
    },
    trim: true,
    notEmpty: {
      errorMessage: APP_MESSAGES.PASSWORD_IS_REQUIRED,
    },
  };

  public static confirm_new_password: ParamSchema = {
    ...ParamsValidation.password,
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.new_password) {
          throw new AppError(APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
        }
        return true;
      },
    },
  };

  public static code: ParamSchema = {
    in: ['body'],
    notEmpty: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
    },
    trim: true,
    isString: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
    },
  };

  public static phone: ParamSchema = {
    in: ['body'],
    trim: true,
    isString: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_REQUIRED,
    },
    isMobilePhone: {
      errorMessage: APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_INVALID,
    },
  };

  public static address: ParamSchema = {
    in: ['body'],
  };

  public static date: ParamSchema = {
    in: ['body'],
    isDate: true,
  };

  public static name: ParamSchema = {
    in: ['body'],
    trim: true,
    isString: {
      errorMessage: 'Name is not valid',
    },
    isLength: {
      errorMessage: 'Name must be at least 1 characters and less than 50 characters',
      options: { min: 1, max: 50 },
    },
  };

  public static gender: ParamSchema = {
    isBoolean: {
      errorMessage: 'Gender is boolean',
    }
  };
}
