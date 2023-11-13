import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import PostServices from '~/services/post.services';
import UserServices from '~/services/user.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { buildBaseQuery, buildOrder, buildQuery } from '~/utils/build_query';
import { BaseQuery } from '~/models/PostQuery';
import CommonServices from '~/services/common.services';
import { Unit } from '~/domain/databases/entity/Unit';
import { Developer } from '~/domain/databases/entity/Developer';
import { PropertyType } from '~/domain/databases/entity/PropertyType';
import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import AppResponse from '~/models/AppRespone';
class AdminController {
  private UnitsService = new CommonServices(Unit);
  private DeveloperService = new CommonServices(Developer);
  private PropertyTypeService = new CommonServices(PropertyType);
  private MembershipPackageService = new CommonServices(MembershipPackage);
  private DiscountCodeService = new CommonServices(DiscountCode);
  public readonly getUnits = wrapRequestHandler(async (req: Request, res: Response) => {
    const baseQuery = buildBaseQuery(req.query);
    const data = await this.UnitsService.getAllByQuery(baseQuery);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_UNIT_INFO_SUCCESSFULLY,
      result: data,
    };
    res.status(200).json(appRes);
  });
  public readonly createUnit = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = {
      id: req.body.id,
      unit_name: req.body.unit_name,
    };
    const unit = await this.UnitsService.create(data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'APP_MESSAGES.SUCCESS_MESSAGE.CREATE_UNIT_SUCCESSFULLY',
      result: unit,
    };
    res.status(200).json(appRes);
  });

  public readonly updateUnit = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let data: Record<string, any> = {};
    if (req.body.unit_name) {
      data.unit_name = req.body.unit_name;
    }
    const result = await this.UnitsService.update(id, data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_UNIT_SUCCESSFULLY',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deleteUnit = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.UnitsService.markDeleted(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'APP_MESSAGES.SUCCESS_MESSAGE.DELETE_UNIT_SUCCESSFULLY',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = PostServices.buildPostQuery(req.query);
    const posts = await PostServices.getPostsByQuery(query, req.user?.id);
    const appRes = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
      num_of_pages: posts.numberOfPages,
      result: posts.data,
    };
    res.status(200).json(appRes);
  });

  public readonly approvePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.post.id;
    if(req.post.status === 'approved') {
      const appRes = {
        status: 'error',
        code: ServerCodes.AdminCode.PostAlreadyApproved,
        message: "Post is already approved",
        result: null,
      };
      return res.status(400).json(appRes);
    }
    const result = await AdminService.approvePost(id as string);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.APPROVE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly rejectPost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.query;
    const { reason } = req.body || "Not provided";
    const result = await AdminService.rejectPost(id as string, reason);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.REJECT_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.query
    const result = await AdminService.deletePost(id as string);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
      result: result,
    };

    res.status(200).json(appRes);
  });

  public readonly getUsers = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = UserServices.buildUserQuery(req.query);
    const users = await UserServices.getUserByQuery(query);
    // return res.json(users);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
      num_of_pages: users.num_of_pages,
      result: users.users as any,
    };
    console.log(appRes);
    res.status(200).json(appRes);
  });

  public readonly banUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ban_reason, banned_util } = req.body;
    const result = await UserServices.banUser(id, ban_reason, banned_util);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Ban user successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly unbanUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.unbanUser(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Unban user successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getDevelopers = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const developers = await this.DeveloperService.getAllByQuery(query);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_DEVELOPER_INFO_SUCCESSFULLY,
      num_of_pages: developers.num_of_pages,
      result: developers.data,
    };
    res.status(200).json(appRes);
  });

  public readonly createDeveloper = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const developer = await this.DeveloperService.create(data);
    // return res.json(developer);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
      result: developer,
    };
    res.status(200).json(appRes);
  });

  public readonly updateDeveloper = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let data: Record<string, any> = {};
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.description) {
      data.description = req.body.description;
    }
    if (req.body.images) {
      data.images = req.body.images;
    }
    const result = await this.DeveloperService.update(id, data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deleteDeveloper = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.DeveloperService.markDeleted(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Delete developer successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getPropertyTypes = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const propertyTypes = await this.PropertyTypeService.getAllByQuery(query);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_PROPERTY_TYPE_INFO_SUCCESSFULLY,
      result: propertyTypes,
    };
    res.status(200).json(appRes);
  });

  public readonly createPropertyType = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = {
      id: req.body.id,
      name: req.body.name,
    };
    const propertyType = await this.PropertyTypeService.create(data);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_PROPERTY_TYPE_SUCCESSFULLY,
      result: propertyType,
    };
    res.status(200).json(appRes);
  });

  public readonly updatePropertyType = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    let data: Record<string, any> = {};
    if (req.body.name) {
      data.name = req.body.name;
    }

    const result = await this.PropertyTypeService.update(id, data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_PROPERTY_TYPE_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deletePropertyType = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.PropertyTypeService.markDeleted(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getMembershipPackages = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const membershipPackages = await this.MembershipPackageService.getAllByQuery(query);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_MEMBERSHIP_PACKAGE_INFO_SUCCESSFULLY,
      result: membershipPackages,
    };
    res.status(200).json(appRes);
  });

  public readonly createMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const membershipPackage = await this.MembershipPackageService.create(data);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
      result: membershipPackage,
    };
    res.status(200).json(appRes);
  });

  // Delete membership package
  public readonly deleteMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.MembershipPackageService.markDeleted(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_MEMBERSHIP_PACKAGE_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getDiscountCodes = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const discountCodes = await this.DiscountCodeService.getAllByQuery(query);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_MEMBERSHIP_PACKAGE_INFO_SUCCESSFULLY,
      result: discountCodes,
    };
    res.status(200).json(appRes);
  });

  public readonly createDiscountCode = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const discountCode = await this.DiscountCodeService.create(data);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_DISCOUNT_CODE_SUCCESSFULLY,
      result: discountCode,
    };
    res.status(200).json(appRes);
  });

  // Delete discount code
  public readonly deleteDiscountCode = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.DiscountCodeService.markDeleted(id);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_DISCOUNT_CODE_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });
}

export default new AdminController();
