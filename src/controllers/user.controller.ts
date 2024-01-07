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
import { App } from '@onesignal/node-onesignal';
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
    const id = req.params.id === null || req.params.id === undefined ? req.user!.id : req.params.id;
    const data = await this.userServices.getUserInfo(id as string);
    if (data === null || data === undefined) {
      return next(
        AppError.notFound({
          message: 'User not found',
        }),
      );
    }
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
      result: data,
    };
    res.status(200).json(appRes);
  });

  // followOrUnfollowUser(accessTokenValidation: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<void>)[], followOrUnfollowUser: any) {
  //   throw new Error('Method not implemented.');
  // }

  public followOrUnfollowUser = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user!.id;
    const follow_id = req.params.id;
    if (user_id === follow_id) {
      return next(AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'You can not follow yourself'));
    }
    const userFollow = await this.userServices.followOrUnfollowUser(user_id, follow_id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: userFollow ? 'Followed successfully' : 'Unfollowed successfully',
    };
    res.status(200).json(appRes);
  });

  public getNumberOfFollowingAndFollowers = wrapRequestHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user!.id;
      const { num_of_following, num_of_followers } = await this.userServices.getFollowingUsers(user_id);
      const appRes: AppResponse = {
        status: 'success',
        code: ServerCodes.UserCode.Success,
        message: "Get user's following and followers successfully",
        result: {
          num_of_following,
          num_of_followers,
        },
      };
      res.status(200).json(appRes);
    },
  );
}

export default UserController;
