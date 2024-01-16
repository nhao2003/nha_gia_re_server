import { checkSchema } from 'express-validator';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { AppError } from '~/models/Error';
import { UserPayload, VerifyResult, verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import AuthServices from '~/services/auth.service';
import ServerCodes from '~/constants/server_codes';
import { Service } from 'typedi';

import { ParamsValidation } from '~/validations/params_validation';
import { User } from '~/domain/databases/entity/User';

@Service()
class AuthValidation {
  private authServices: AuthServices;
  constructor(auth: AuthServices) {
    this.authServices = auth;
  }
  public getUserByTokenIfExist = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return next();
    }
    const access_token = authorization?.split(' ')[1];
    if (!access_token) {
      // return next(new AppError(APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, HTTP_STATUS.UNAUTHORIZED));
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, {
        serverCode: ServerCodes.AuthCode.AccessTokenIsRequired,
      });
      return next(error);
    }
    const result = await verifyToken(access_token, process.env.JWT_SECRET_KEY as string);
    if (!result) {
      // return next(new AppError(APP_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
        serverCode: ServerCodes.AuthCode.InvalidCredentials,
      });
      return next(error);
    }
    if (result.expired || !result.payload) {
      // return next(new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
        serverCode: ServerCodes.AuthCode.TokenIsExpired,
      });
      return next(error);
    }
    const session = await this.authServices.checkSessionExist((result.payload as UserPayload).session_id);
    if (session === null || session === undefined) {
      // return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
        serverCode: ServerCodes.AuthCode.InvalidCredentials,
      });
      return next(error);
    }
    const user = await this.authServices.checkUserExistByID(session.user_id);
    if (user === null || user === undefined) {
      // return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
        serverCode: ServerCodes.AuthCode.InvalidCredentials,
      });
      return next(error);
    }
    req.user = user;
    req.session = session;
    next();
  });
  public readonly signUpValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
        confirmPassword: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.password) {
                return false;
              }
              return true;
            },
          },
        },
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;
      const user = await this.authServices.checkUserExistByEmail(email);
      if (user) {
        return res.status(HttpStatus.CONFLICT).json({
          status: 'error',
          code: ServerCodes.AuthCode.EmailAlreadyExsist,
          message: APP_MESSAGES.ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        });
      }
      next();
    },
  ];
  public readonly signInValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const { user, password_is_correct } = await this.authServices.getUserByEmailAndPassword(email, password);
      if (user === null || user === undefined) {
        return next(
          AppError.notFound({
            message: APP_MESSAGES.USER_NOT_FOUND,
          }),
        );
      }
      if (user.status === UserStatus.unverified) {
        // return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.USER_NOT_VERIFIED, {
            serverCode: ServerCodes.AuthCode.UserIsNotVerified,
          }),
        );
      }
      if (password_is_correct === false) {
        // return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 400));
        return next(
          new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, {
            serverCode: ServerCodes.AuthCode.InvalidCredentials,
          }),
        );
      }
      req.user = user;
      next();
    },
  ];

  public readonly acctiveAccountValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      password: ParamsValidation.password,
      code: ParamsValidation.code,
    }),
  );

  public readonly resendActivationCodeValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public readonly accessTokenValidation = [
    wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      const access_token = authorization?.split(' ')[1];
      if (!access_token) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, {
            serverCode: ServerCodes.AuthCode.AccessTokenIsRequired,
          }),
        );
      }
      const { payload, expired } = await verifyToken(access_token, process.env.JWT_SECRET_KEY as string);
      if (expired) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
            serverCode: ServerCodes.AuthCode.TokenIsExpired,
          }),
        );
      }
      if (!payload) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
            serverCode: ServerCodes.AuthCode.InvalidCredentials,
          }),
        );
      }
      const session = await this.authServices.checkSessionExist((payload as UserPayload).session_id);
      if (session === null || session === undefined) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
            serverCode: ServerCodes.AuthCode.InvalidCredentials,
          }),
        );
      }
      const user = await this.authServices.checkUserExistByID(session.user_id);
      if (user === null || user === undefined) {
        return next(
          new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
            serverCode: ServerCodes.AuthCode.InvalidCredentials,
          }),
        );
      }
      req.user = user;
      req.session = session;
      next();
    }),
  ];

  public refreshTokenValidation = validate(
    checkSchema({
      refresh_token: {
        in: ['body'],
        notEmpty: {
          errorMessage: APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        },
        trim: true,
        isString: true,
      },
    }),
  );

  public readonly forgotPasswordValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public readonly verifyRecoveryTokenValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      code: ParamsValidation.code,
    }),
  );

  public readonly resetPasswordValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        code: ParamsValidation.code,
        new_password: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.confirm_password) {
                // return next( new AppError(APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
                return false;
              }
              return true;
            },
          },
        },
      }),
    ),
    // async (req: Request, res: Response, next: NextFunction) => {
    //   const { email, code } = req.body;
    //   const userService = new AuthServices();
    //   const user = await userService.checkUserExistByEmail(email);
    //   if (user === undefined || user === null) {
    //     return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    //   }
    //   const otp = await userService.getOTP(user.id, code, 'reset-password');
    //   if (otp === null) {
    //     return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
    //   }
    //   next();
    // },
  ];

  protect = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { payload, expired } = req.verifyResult as VerifyResult;

    if (payload !== null && !expired) {
      const userRepo = User.getRepository();
      const user = await userRepo.findOne({ where: { id: (payload as UserPayload).id } });
      if (user !== null) {
        if (user.status === UserStatus.unverified) {
          // return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
          return next(
            new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.USER_NOT_VERIFIED, {
              serverCode: ServerCodes.AuthCode.UserIsNotVerified,
            }),
          );
        } else {
          return next();
        }
      } else {
        next(
          AppError.notFound({
            message: APP_MESSAGES.USER_NOT_FOUND,
          }),
        );
      }
    }
    if (expired) {
      const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.TOKEN_IS_EXPIRED, {
        serverCode: ServerCodes.AuthCode.TokenIsExpired,
      });
      next(error);
    }
    const error = new AppError(HttpStatus.UNAUTHORIZED, APP_MESSAGES.INVALID_TOKEN, {
      serverCode: ServerCodes.AuthCode.InvalidCredentials,
    });
    next(error);
  });

  changePasswordValidation = validate(
    checkSchema({
      new_password: {
        in: ['body'],
        isLength: {
          errorMessage: APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
          options: { min: 8, max: 32 },
        },
        trim: true,
        notEmpty: {
          errorMessage: APP_MESSAGES.PASSWORD_IS_REQUIRED,
        },
      },
    }),
  );
}

export default AuthValidation;
