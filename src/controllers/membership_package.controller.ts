import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import MembershipPackageService from '~/services/membership_package.services';
import AppResponse from '~/models/AppRespone';
import { Request, Response } from 'express';
import HTTP_STATUS from '~/constants/httpStatus';
import { Service } from 'typedi';

@Service()
class MembershipPackageController {
  private membershipPackageService: MembershipPackageService;

  constructor(membershipPackageService: MembershipPackageService) {
    this.membershipPackageService = membershipPackageService;
  }

  public readonly getMembershipPackages = wrapRequestHandler(async (req, res) => {
    const query = buildBaseQuery(req.query);
    const membershipPackages = await this.membershipPackageService.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get membership packages successfully',
      result: membershipPackages,
    };
    res.status(200).json(appRes);
  });

  public readonly getMembershipPackageById = wrapRequestHandler(async (req, res) => {
    const membershipPackage = await this.membershipPackageService.getById(req.params.id);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get membership package successfully',
      result: membershipPackage,
    };
    res.status(200).json(appRes);
});
 public readonly getCurrentUserMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const user_id = req.user ? req.user.id : req.body.user_id;
    const email = req.user ? req.user.email : req.body.email;
    const phone = req.user ? req.user.phone : req.body.phone;
    if (!user_id && !email && !phone) {
      const appRes: AppResponse = {
        status: 'error',
        code: HTTP_STATUS.BAD_REQUEST,
        message: "Missing 'user_id' or 'email' or 'phone' in request body",
        result: null,
      };
      return res.status(HTTP_STATUS.BAD_REQUEST).json(appRes);
    }
    const membershipPackage = await this.membershipPackageService.getCurrentUserSubscriptionPackage(user_id, email, phone);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get current user membership package successfully',
      result: membershipPackage,
    };
    res.status(200).json(appRes);
  });

  public getUserWithSubscriptionPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    let { user_id, email, phone } = req.query;
    user_id = user_id ? decodeURIComponent(user_id as string) : user_id;
    email = email ? decodeURIComponent(email as string) : email;
    phone = phone ? decodeURIComponent(phone as string) : phone;

    if (!user_id && !email && !phone) {
      const appRes: AppResponse = {
        status: 'error',
        code: HTTP_STATUS.BAD_REQUEST,
        message: "Missing 'user_id' or 'email' or 'phone' in request body",
        result: null,
      };
      return res.status(HTTP_STATUS.BAD_REQUEST).json(appRes);
    }
    const result = await this.membershipPackageService.getUserWithSubscriptionPackage(email, phone, user_id);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get user with subscription package successfully',
      result,
    };
    res.status(200).json(appRes);
  });
}

export default MembershipPackageController;
