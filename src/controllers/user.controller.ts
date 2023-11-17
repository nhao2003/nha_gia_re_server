import filterBody from '~/utils/filterBody';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import UserServices from '~/services/user.service';
import { AppError } from '~/models/Error';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import AppResponse from '~/models/AppRespone';
import { Service } from 'typedi';
@Service()
class UserController {
  private userServices: UserServices;

  constructor(userServices: UserServices) {
    this.userServices = userServices;
  }

  public updateProfile = wrapRequestHandler(async (req: Request, res) => {
    let filteredBody = filterBody(req.body, ['first_name', 'last_name', 'gender', 'address', 'phone', 'dob']);
    const user = req.user;

    if (user!.status === UserStatus.not_update) {
      filteredBody = {
        ...filteredBody,
        status: UserStatus.verified,
      };
    }
    await this.userServices.updateUserInfo(user!.id, filteredBody);
    // res.status(200).json({
    //   message: 'Profile updated successfully.',
    //   data: filteredBody,
    // });
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_USER_INFO_SUCCESSFULLY,
    };
    res.status(200).json(appRes);
  });

  public getUserProfile = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id === null || req.params.id === undefined ? req.user!.id : req.params.id;
    const data = await this.userServices.getUserInfo(id as string);
    if (data === null || data === undefined) {
      return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
    }
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
      result: data,
    };
    res.status(200).json(appRes);
  });
}

export default UserController;
