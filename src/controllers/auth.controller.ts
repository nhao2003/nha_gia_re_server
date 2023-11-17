import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

import { NextFunction, Request, Response } from 'express';
import { AppError } from '~/models/Error';
import { APP_MESSAGES } from '~/constants/message';
import { OTPTypes } from '~/constants/enum';
import ServerCodes from '~/constants/server_codes';
import { verifyPassword } from '~/utils/crypto';
import { Service } from 'typedi';
import { User } from '~/domain/databases/entity/User';
import AppResponse from '~/models/AppRespone';
import AuthServices from '~/services/auth.service';
@Service()
class AuthController {
  constructor(private authServices: AuthServices) {}
  public signUp = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const otp_code = await this.authServices.signUp(email, password);
    // await sendConfirmationEmail(email, token);

    res.status(200).json({
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SIGN_UP_SUCCESSFULLY,
      result: {
        otp_code,
      },
    } as AppResponse);
  });

  //Resend Activation OTP Code
  public resendActivationCode = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const otp_code = await this.authServices.resendOTPCode(email);

    if (otp_code === null || otp_code === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    res.status(200).json({
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.RESEND_ACTIVATION_CODE_SUCCESSFULLY,
      result: {
        otp_code,
      },
    } as AppResponse);
  });

  public activeAccount = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, code } = req.body;
    const { user } = await this.authServices.getUserByEmailAndPassword(email, password);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
    }
    const verifyOTPCodes = await this.authServices.verifyOTPCodeAndUse(user.id, code, OTPTypes.account_activation);
    if (verifyOTPCodes === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
    }
    const active = await this.authServices.activeAccount(user.id);
    if (active === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.YOUR_ACCOUNT_IS_ALREADY_ACTIVE, 404));
    }
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.ACTIVE_ACCOUNT_SUCCESSFULLY,
      result: {
        access_token,
        refresh_token,
      },
    };

    res.status(200).json(appRes);
  });

  public signIn = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    // Create new session
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_IN_SUCCESSFULLY,
      result: {
        access_token,
        refresh_token,
      },
    };
    res.status(200).json(appRes);
  });

  public refreshToken = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;
    const access_token = await this.authServices.grantNewAccessToken(refresh_token);
    if (access_token === null || access_token === undefined) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.REFRESH_TOKEN_IS_EXPIRED_OR_INVALID, 401));
    }

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.RENEW_ACCESS_TOKEN_SUCCESSFULLY,
      result: {
        access_token,
      },
    };
    res.status(200).json(appRes);
  });

  public signOut = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    await this.authServices.signOut(req.session!.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_SUCCESSFULLY,
    };
    res.status(200).json(appRes);
  });

  public signOutAll = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    await this.authServices.signOutAll(req.session!.user_id);
    // res.status(200).json({
    //   status: 'success',
    //   message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
    // });
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
    };
    res.status(200).json(appRes);
  });

  public changePassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { old_password, new_password } = req.body;
    const user = req.user;
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const isMatch = verifyPassword(old_password, user.password as string);
    if (!isMatch) {
      return next(new AppError(APP_MESSAGES.INCORRECT_PASSWORD, 400));
    }
    await this.authServices.changePassword(user.id, new_password);
    // Sign out all session
    await this.authServices.signOutAll(user.id);
    // Create new session
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY,
      result: {
        access_token,
        refresh_token,
      },
    };
    res.status(200).json(appRes);
  });

  public forgotPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const otp_code = await this.authServices.forgetPassword(email);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY,
      result: {
        otp_code,
      },
    };
    res.status(200).json(appRes);
  });

  public verifyRecoveryPasswordOTP = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;
    const user = await this.authServices.checkUserExistByEmail(email);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const verifyOTPCodes = await this.authServices.getOTP(user.id, code, OTPTypes.password_recovery);
    if (verifyOTPCodes === null) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
    }
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.OTP_CODE_IS_CORRECT,
    };

    res.status(200).json(appRes);
  });

  public resetPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, code, new_password } = req.body;
    const user = await this.authServices.checkUserExistByEmail(email);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const verifyOTPCodes = await this.authServices.verifyOTPCodeAndUse(user.id, code, OTPTypes.password_recovery);
    if (verifyOTPCodes === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
    }
    await this.authServices.changePassword(user.id, new_password);
    // Sign out all session
    await this.authServices.signOutAll(user.id);
    // Create new session
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.RESET_PASSWORD_SUCCESSFULLY,
      result: {
        access_token,
        refresh_token,
      },
    };

    res.status(200).json(appRes);
  });
}

export default AuthController;
