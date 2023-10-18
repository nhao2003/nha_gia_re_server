import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

import { NextFunction, Request, Response } from 'express';
import { AppError } from '~/models/Error';
import { APP_MESSAGES } from '~/constants/message';
import { OTPTypes } from '~/constants/enum';
import { sendConfirmationEmail } from '~/services/mail.services';
import AuthServices from '~/services/auth.services';
import ServerCodes from '~/constants/server_codes';
import { verify } from 'jsonwebtoken';
import { verifyPassword } from '~/utils/crypto';

 class AuthController {
  private authServices: AuthServices;
   
  constructor() {
    this.authServices = new AuthServices();
  }
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
    });
  });

  public activeAccount = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const  {email, password, code} = req.body;
    const user = await this.authServices.getUserByEmailAndPassword(email, password);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
    }
    const verifyOTPCodes = await this.authServices.verifyOTPCode(user.id, code, OTPTypes.account_activation);
    if (verifyOTPCodes === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
    }
    const active = await this.authServices.activeAccount(user.id);
    if (active === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.YOUR_ACCOUNT_IS_ALREADY_ACTIVE, 404));
    }
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    res.status(200).json({
      status: 'success',
      result: {
        access_token,
        refresh_token,
      },
    });
  });

  public signIn = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await this.authServices.getUserByEmailAndPassword(email, password);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
    }
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    res.status(200).json({
      status: 'success',
      result: {
        access_token,
        refresh_token,
      }
    });
  });

  public refreshToken = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;
    const access_token = await this.authServices.grantNewAccessToken(refresh_token);
    if (access_token === null || access_token === undefined) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.REFRESH_TOKEN_IS_EXPIRED_OR_INVALID, 401));
    }
    res.status(200).json({
      status: 'success',
      result: {
        access_token,
      },
    });
  });


  public signOut = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    await this.authServices.signOut(req.session!.id);
    res.status(200).json({
      status: 'success',
      message: APP_MESSAGES.SIGN_OUT_SUCCESSFULLY,
    });
  });

  public signOutAll = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    await this.authServices.signOutAll(req.session!.user_id);
    res.status(200).json({
      status: 'success',
      message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
    });
  });

  public changePassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { old_password, new_password } = req.body;
    const user = req.user;
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const isMatch = verifyPassword(old_password, user.password);
    if (!isMatch) {
      return next(new AppError(APP_MESSAGES.INCORRECT_PASSWORD, 400));
    }
    await this.authServices.changePassword(user.id, new_password);
    res.status(200).json({
      status: 'success',
      message: APP_MESSAGES.SUCCESS_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY,
    });
  });

  public forgotPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const otp_code = await this.authServices.forgetPassword(email);
    res.status(200).json({
      status: 'success',
      code: ServerCodes.AuthCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY,
      result: {
        otp_code,
      },
    });
  });

  public verifyForgotPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;
    const user = await this.authServices.checkUserExistByEmail(email);
    if (user === null || user === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const verifyOTPCodes = await this.authServices.verifyOTPCode(user.id, code, OTPTypes.password_recovery);
    if (verifyOTPCodes === false) {
      return next(new AppError(APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
    }
    await this.authServices.signOutAll(user.id);
    const { access_token, refresh_token } = await this.authServices.createSession(user.id);
    res.status(200).json({
      status: 'success',
      message: APP_MESSAGES.SUCCESS_MESSAGE.YOUR_ACCOUNT_HAS_BEEN_SIGN_OUT_ON_ALL_DEVICES_YOU_CAN_CHANGE_PASSWORD_NOW,
      result: {
        access_token,
        refresh_token,
      },
    });
  });
}

export default new AuthController();