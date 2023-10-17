import { wrapRequestHandler } from "~/utils/wrapRequestHandler";

import { NextFunction, Request, Response } from "express";
import { AppError } from "~/models/Error";
import { generateCode, hashPassword, hashString, verifyPassword } from "~/utils/crypto";
import { APP_MESSAGES } from "~/constants/message";
import { UserPayload, VerifyResult, signToken, verifyToken } from "~/utils/jwt";
import { generateRefreshToken, generateToken } from "~/services/auth.services";
import { UserStatus } from "~/constants/enum";
import { sendConfirmationEmail, sendEmail, sendRecoveryPasswordEmail } from "~/services/mail.services";
import authServices from "~/services/auth.services";
import HTTP_STATUS from "~/constants/httpStatus";
import { User } from "~/domain/databases/entity/User";
import { Session } from "~/domain/databases/entity/Sesstion";
import { Unit } from "~/domain/databases/entity/Unit";

export const signUp = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const userRepo = User.getRepository();
  const user = await userRepo.insert({ email, password: hashPassword(password) });
  const token = await signToken({
    payload: {
      id: user.identifiers[0].id
    },
    expiresIn: process.env.EMAIL_VERIFICATION_EXPIRES_IN as string
  });
  await sendConfirmationEmail(email, token);
  res.status(200).json({
    status: "success",
    result: {
      message: APP_MESSAGES.SIGN_UP_SUCCESSFULLY
    }
  });
});

export const signIn = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // const user = await User.findOne({ email }).select("+password");
  // if (!user || !verifyPassword(password, user.password)) {
  //   return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
  // }

  const userRepo = User.getRepository();
  const user = await userRepo.findOne({ where: { email: email, password: hashPassword(password) } });
  if (user === null) {
    return next(new AppError(APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
  }

  const sessionRepo = Session.getRepository();
  const session = new Session();
  session.user_id = user.id;
  session.starting_date = new Date();
  //Expiration date is 30 days from now
  session.expiration_date = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
  session.updated_at = session.starting_date;
  await sessionRepo.save(session);
  const refreshToken = await generateRefreshToken(user.id, session.id);
  const token = await generateToken(user.id, session.id);
  res.status(200).json({
    status: "success",
    result: {
      token,
      refreshToken
    }
  });
});

export const refreshToken = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result: VerifyResult = req.verifyResultRefreshToken as VerifyResult;
  const userPayLoad = result.payload as UserPayload;
  const token = await generateToken((result.payload as UserPayload).id, userPayLoad.id);
  res.status(200).json({
    status: "success",
    result: {
      token: token
    }
  });
  return;
});

export const signOut = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError(APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED, 400));
  }
  const result: VerifyResult = await verifyToken(refreshToken, process.env.JWT_SECRET_KEY as string);
  if (result.payload) {
    // await RefreshToken.deleteOne({ token: refreshToken });
    const userPayLoad = result.payload as UserPayload;
    const sessionRepo = Session.getRepository();
    const session = await sessionRepo.findOne({ where: { id: userPayLoad.session_id } });
    if (session !== null) {
      await sessionRepo.remove(session);
      res.status(200).json({
        status: "success",
        result: {
          message: APP_MESSAGES.SIGN_OUT_SUCCESSFULLY
        }
      });
      return;
    } else {
      return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
    }
  }
  return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
});

export const changePassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword } = req.body;
  const { payload, expired } = req.verifyResult as VerifyResult;
  // Check if old password is correct
  // const user = await User.findById((payload as UserPayload).id).select("+password");
  // if (!user || !verifyPassword(password, user.password)) {
  //   return next(new AppError(APP_MESSAGES.INCORRECT_PASSWORD, 400));
  // }
  // user.password = newPassword;
  // await user.save();
  // res.status(200).json({
  //   status: "success",
  //   result: {
  //     user
  //   }
  // });
  const userRepo = User.getRepository();
  const user = await userRepo.findOne({ where: { id: (payload as UserPayload).id, password: hashPassword(password) } });
  if (user === null) {
    return next(new AppError(APP_MESSAGES.INCORRECT_PASSWORD, 400));
  }
  user.password = newPassword;
  await userRepo.save(user);
  res.status(200).json({
    status: "success",
    result: {
      user
    }
  });
});

export const verifyEmail = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  const result = await verifyToken(token, process.env.JWT_SECRET_KEY as string);
  if (result.payload) {
    // const user = await User.findById((result.payload as UserPayload).id);
    const userRepo = User.getRepository();
    const user = await userRepo.findOne({ where: { id: (result.payload as UserPayload).id } });
    if (!user) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    //TODO: Check if user is verified
    // if (user.confirmation_token !== token) {
    //   return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
    // }
    // if (user.status !== UserStatus.unverified) {
    //   return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
    // }
    // user.status = UserStatus.not_update;
    // user.confirmation_token = undefined;
    // user.confirmation_at = new Date();
    await user.save();
    res.status(200).send("Your email has been verified");
    return;
  }
  return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
});

export const signOutAll = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { payload, expired } = req.verifyResult as VerifyResult;
  // const user = await User.findById((payload as UserPayload).id);
  // if (!user) {
  //   return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
  // }
  // await RefreshToken.deleteMany({ user_id: user._id });
  const sessionRepo = Session.getRepository();
  const sessions = await sessionRepo.find({ where: { user_id: (payload as UserPayload).id } });
  if (sessions !== null) {
    await sessionRepo.remove(sessions);
  }
  res.status(200).json({
    status: "success",
    result: {
      message: APP_MESSAGES.SIGN_OUT_SUCCESSFULLY
    }
  });
});

export const forgotPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  //FIXME: Check if user is verifiedS

  // const user = await User.findOne({ email });
  // if (user === null) {
  //   return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
  // }
  // if (user.recovery_sent_at && new Date().getTime() - user.recovery_sent_at.getTime() < 5 * 60 * 1000) {
  //   return next(new AppError(APP_MESSAGES.RECOVERY_EMAIL_SENT, HTTP_STATUS.CONFLICT));
  // }
  // const vertifyCode = generateCode();
  // const hashedVertifyCode = hashString(email + vertifyCode + process.env.RECOVERY_PASSWORD_SERECT_KEY, "md5");
  // console.log(vertifyCode);
  // user.recovery_token = hashedVertifyCode;
  // user.recovery_sent_at = new Date();
  // await user.save();
  // await sendRecoveryPasswordEmail(email, vertifyCode);
  // res.status(200).json({
  //   status: "success",
  //   result: {
  //     message: "Please check your email to reset password"
  //   }
  // });
});

export const verifyRecoveryToken = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  //FIXME: Check if user is verified
  // const { email, vertifyCode } = req.body;
  // const hashedVertifyCode = hashString(email + vertifyCode + process.env.RECOVERY_PASSWORD_SERECT_KEY, "md5");
  // const user = await User.findOne({ email, recovery_token: hashedVertifyCode });
  // if (!user) {
  //   return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
  // }

  // if (new Date().getTime() - user.recovery_sent_at!.getTime() > 5 * 60 * 1000) {
  //   return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
  // }
  // const recoveryToken = await signToken({
  //   payload: {
  //     id: user._id
  //   },
  //   expiresIn: process.env.RECOVERY_PASSWORD_EXPIRES_IN as string,
  //   secretKey: process.env.RECOVERY_PASSWORD_SERECT_KEY as string
  // });
  // res.status(200).json({
  //   status: "success",
  //   result: {
  //     recoveryToken
  //   }
  // });
});

export const resetPassword = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  //TODO: Check if user is verified
  // const { recoveryToken, password } = req.body;
  // const result: VerifyResult = await verifyToken(recoveryToken, process.env.RECOVERY_PASSWORD_SERECT_KEY as string);
  // if (result.expired) {
  //   return next(new AppError(APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
  // }
  // if (!result.payload) {
  //   return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
  // }
  // const user = await User.findById((result.payload as UserPayload).id);
  // if (!user) {
  //   return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
  // }
  // user.password = password;
  // user.recovery_token = undefined;
  // user.recovery_sent_at = undefined;
  // await user.save();
  // await authServices.signOutAll(user._id);
  // res.status(200).json({
  //   status: "success",
  //   result: {
  //     message: APP_MESSAGES.RESET_PASSWORD_SUCCESSFULLY
  //   }
  // });
});
