import { checkSchema } from 'express-validator';
import HTTP_STATUS from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { AppError } from '~/models/Error';
import { UserPayload, VerifyResult, verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';
import { NextFunction, Request, Response } from 'express';
import { hashPassword, verifyPassword } from '~/utils/crypto';
import { wrap } from 'module';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import { User } from '~/domain/databases/entity/User';
import { Session } from '~/domain/databases/entity/Sesstion';
import { ParamsValidation } from '~/validations/params_validation';
import AuthServices from '~/services/auth.services';
import ServerCodes from '~/constants/server_codes';

export class AuthValidation {
  public static readonly signUpValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
        confirmPassword: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.password) {
                throw new AppError(APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
              }
              return true;
            },
          },
        },
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await AuthServices.checkUserExistByEmail(email);
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          status: 'error',
          code: ServerCodes.AuthCode.EMAIL_ALREADY_EXISTS,
          message: APP_MESSAGES.ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        });
      }
      next();
    },
  ];
  public static readonly signInValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        password: ParamsValidation.password,
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const { user, password_is_correct } = await AuthServices.getUserByEmailAndPassword(email, password);
      if (user === null || user === undefined) {
        return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
      }
      if (user.status === UserStatus.unverified) {
        return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
      }
      if (password_is_correct === false) {
        return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 400));
      }
      if (user.status === UserStatus.banned) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: 'fail',
          code: 403,
          message: `You have been banned  ${user.banned_util} because ${user.ban_reason}. Please contact admin for more information`,
          result: {
            banned_util: user.banned_util,
            ban_reason: user.ban_reason,
          }
        });
      }
      req.user = user;
      next();
    },
  ];

  public static readonly acctiveAccountValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      password: ParamsValidation.password,
      code: ParamsValidation.code,
    }),
  );

  public static readonly resendActivationCodeValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public static readonly accessTokenValidation = [
    validate(
      checkSchema({
        Authorization: {
          in: ['headers'],
          notEmpty: {
            errorMessage: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
          },
          trim: true,
        },
      }),
    ),
    async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      const access_token = authorization?.split(' ')[1];
      if (!access_token) {
        return next(new AppError(APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, HTTP_STATUS.UNAUTHORIZED));
      }
      const result = await verifyToken(access_token, process.env.JWT_SECRET_KEY as string);
      if (!result) {
        return next(new AppError(APP_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
      }
      if (result.expired || !result.payload) {
        return next(new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
      }
      const session = await AuthServices.checkSessionExist((result.payload as UserPayload).session_id);
      if (session === null || session === undefined) {
        return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
      }
      const user = await AuthServices.checkUserExistByID(session.user_id);
      if (user === null || user === undefined) {
        return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
      }
      req.user = user;
      req.session = session;
      next();
    },
  ];

  public static readonly refreshTokenValidation = validate(
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

  public static readonly forgotPasswordValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
    }),
  );

  public static readonly verifyRecoveryTokenValidation = validate(
    checkSchema({
      email: ParamsValidation.email,
      code: ParamsValidation.code,
    }),
  );

  public static readonly resetPasswordValidation = [
    validate(
      checkSchema({
        email: ParamsValidation.email,
        code: ParamsValidation.code,
        new_password: {
          ...ParamsValidation.password,
          custom: {
            options: (value, { req }) => {
              if (value !== req.body.confirm_password) {
                throw new AppError(APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
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

  tokenValidation = validate(
    checkSchema({
      Authorization: {
        in: ['headers'],
        notEmpty: {
          errorMessage: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const accessToken = value.split(' ')[1];
            if (!accessToken) {
              return false;
            }
            const result = await verifyToken(accessToken, process.env.JWT_SECRET_KEY as string);
            if (!result) {
              throw new AppError(APP_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
            }
            if (result.expired || !result.payload) {
              throw new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401);
            }
            (req as Request).verifyResult = result;
            return true;
          },
        },
      },
    }),
  );

  protect = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { payload, expired } = req.verifyResult as VerifyResult;

    if (payload !== null && !expired) {
      // req.user = await UserModel.findById((payload as UserPayload).id);
      // if (req.user === null || req.user === undefined) {
      //   return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
      // }
      // if (req.user.status === UserStatus.unverified) {
      //   return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
      // }
      // return next();
      const userRepo = User.getRepository();
      const user = await userRepo.findOne({ where: { id: (payload as UserPayload).id } });
      if (user !== null) {
        if (user.status === UserStatus.unverified) {
          return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
        } else {
          return next();
        }
      } else {
        return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
      }
    }
    if (expired) {
      return next(new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
    }
    return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
  });

  changePasswordValidation = validate(
    checkSchema({
      newPassword: {
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
