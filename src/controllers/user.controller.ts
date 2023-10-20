import filterBody from '~/utils/filterBody';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import UserServices from '~/services/user.services';
import { AppError } from '~/models/Error';
class UserController {
  public updateProfile = wrapRequestHandler(async (req: Request, res) => {
    let filteredBody = filterBody(req.body, ['first_name', 'last_name', 'gender', 'address', 'phone', 'dob']);
    const user = req.user;

    if (user!.status === UserStatus.not_update) {
      filteredBody = {
        ...filteredBody,
        status: UserStatus.verified,
      };
    }
    await UserServices.updateUserInfo(user!.id, filteredBody);
    res.status(200).json({
      message: 'Profile updated successfully.',
      data: filteredBody,
    });
  });

  public getUserProfile = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id === null || req.params.id === undefined ? req.user!.id : req.params.id;
    const data = await UserServices.getUserInfo(id as string);
    if (data === null || data === undefined) {
      return next(new AppError('User not found.', 404));
    }
    const filter = data.toJSON();

    res.status(200).json({
      message: 'Get user profile successfully.',
      result: filter,
    });
  });
}

export default new UserController();
