import filterBody from '~/utils/filterBody';
import { Request } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { UserStatus } from '~/constants/enum';
import UserServices from '~/services/user.services';
class UserController {
  public updateProfile = wrapRequestHandler(async (req: Request, res) => {
    let filteredBody = filterBody(req.body, ['first_name', 'last_name', 'gender', 'address', 'phone', 'dob']);
    const user = req.user;
    
    if(user!.status === UserStatus.not_update) {
      filteredBody = {
        ...filteredBody,
        status: UserStatus.verified
      }
    }
    await UserServices.updateUserInfo(user!.id, filteredBody);
    res.status(200).json({
      message: 'Profile updated successfully.',
      data: filteredBody,
    });
  });
}

export default new UserController();
