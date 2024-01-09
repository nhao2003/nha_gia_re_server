import { Request, Response } from 'express';
import AdminService from '../services/admin.service';
import PostServices from '~/services/post.service';
import UserServices from '~/services/user.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { buildBaseQuery } from '~/utils/build_query';
import CommonServices from '~/services/common.service';
import { Developer } from '~/domain/databases/entity/Developer';
import { PropertyType } from '~/domain/databases/entity/PropertyType';
import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import AppResponse from '~/models/AppRespone';
import { DataSource } from 'typeorm';
import { Service } from 'typedi';
import MembershipPackageServices from '~/services/membership_package.service';
import { DiscountCodeService } from '~/services/discount_code.service';
import BlogService from '~/services/blog.service';
import ReportService from '~/services/report.service';

@Service()
class AdminController {
  private DeveloperService: CommonServices;
  private PropertyTypeService: CommonServices;
  private membershipPackageService: MembershipPackageServices;
  private discountCodeService: DiscountCodeService;
  private adminService: AdminService;
  private userServices: UserServices;
  private postServices: PostServices;
  private blogServices: BlogService;
  private reportService: ReportService;
  constructor(
    dataSource: DataSource,
    adminService: AdminService,
    userServices: UserServices,
    postServices: PostServices,
    blogServices: BlogService,
    reportService: ReportService,
  ) {
    this.DeveloperService = new CommonServices(Developer, dataSource);
    this.PropertyTypeService = new CommonServices(PropertyType, dataSource);
    this.membershipPackageService = new MembershipPackageServices(dataSource);
    this.discountCodeService = new DiscountCodeService(dataSource);
    this.adminService = adminService;
    this.userServices = userServices;
    this.postServices = postServices;
    this.blogServices = blogServices;
    this.reportService = reportService;
  }

  public readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = this.postServices.buildPostQuery(req.query);
    const posts = await this.postServices.getPostsByQuery(query, req.user?.id);
    const appRes: AppResponse = {
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
    if (req.post.status === 'approved') {
      const appRes: AppResponse = {
        status: 'error',
        code: ServerCodes.AdminCode.PostAlreadyApproved,
        message: 'Post is already approved',
        result: null,
      };
      return res.status(400).json(appRes);
    }
    const result = await this.adminService.approvePost(id as string);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.APPROVE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly rejectPost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.query;
    const { reason } = req.body || 'Not provided';
    const result = await this.adminService.rejectPost(id as string, reason);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.REJECT_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.query;
    const result = await this.adminService.deletePost(id as string);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
      result: result,
    };

    res.status(200).json(appRes);
  });

  public readonly getUsers = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = this.userServices.buildUserQuery(req.query);
    const users = await this.userServices.getUserByQuery(query);
    // return res.json(users);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
      num_of_pages: users.num_of_pages,
      result: users.users as any,
    };
    // console.log(appRes);
    res.status(200).json(appRes);
  });

  public readonly banUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ban_reason, banned_util } = req.body;
    const result = await this.userServices.banUser(id, ban_reason, banned_util);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Ban user successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly unbanUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.userServices.unbanUser(id);
    const appRes: AppResponse = {
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
    const appRes: AppResponse = {
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

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
      result: developer,
    };
    res.status(200).json(appRes);
  });

  public readonly updateDeveloper = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: Record<string, any> = {};
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
    const appRes: AppResponse = {
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
    const appRes: AppResponse = {
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
    const appRes: AppResponse = {
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

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_PROPERTY_TYPE_SUCCESSFULLY,
      result: propertyType,
    };
    res.status(200).json(appRes);
  });

  public readonly updatePropertyType = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: Record<string, any> = {};
    if (req.body.name) {
      data.name = req.body.name;
    }

    const result = await this.PropertyTypeService.update(id, data);
    const appRes: AppResponse = {
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
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getMembershipPackages = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const membershipPackages = await this.membershipPackageService.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_MEMBERSHIP_PACKAGE_INFO_SUCCESSFULLY,
      num_of_pages: membershipPackages.num_of_pages,
      result: membershipPackages.data,
    };
    res.status(200).json(appRes);
  });

  public readonly createMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const membershipPackage = await this.membershipPackageService.create(data);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
      result: membershipPackage,
    };
    res.status(200).json(appRes);
  });

  public readonly updateMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.membershipPackageService.update(id, req.body);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Update membership package successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  // Delete membership package
  public readonly deleteMembershipPackage = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.membershipPackageService.markDeleted(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_MEMBERSHIP_PACKAGE_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly getDiscountCodes = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const discountCodes = await this.discountCodeService.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Get discount code successfully',
      num_of_pages: discountCodes.num_of_pages,
      result: discountCodes.data,
    };
    res.status(200).json(appRes);
  });

  public readonly createDiscountCode = wrapRequestHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const discountCode = await this.discountCodeService.create(data);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_DISCOUNT_CODE_SUCCESSFULLY,
      result: discountCode,
    };
    res.status(200).json(appRes);
  });

  //Get discount code by id
  public readonly getDiscountCodeById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const discountCode = await this.discountCodeService.getById(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Get discount code successfully',
      result: discountCode,
    };
    res.status(200).json(appRes);
  });

  // Delete discount code
  public readonly deleteDiscountCode = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.discountCodeService.markDeleted(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_DISCOUNT_CODE_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly dashboard = wrapRequestHandler(async (req: Request, res: Response) => {
    const countPostByStatus = this.postServices.countPostByStatus();
    const countPostByTypeInMonthOfYear = this.postServices.countPostByTypeInMonthOfYear();
    const countUserByIdentityVerified = this.userServices.countUserByIdentityVerified();
    const countUserPerStatus = this.userServices.countUserPerStatus();
    const countSubscriptionPackage = this.membershipPackageService.countSubscriptionPackage();
    const getTop10UsersHaveMostPosts = this.postServices.getTop10UsersHaveMostPosts();
    const countReportPerStatus = this.reportService.countReportPerStatus();
    const countBlog = this.blogServices.countBlog();

    const result = await Promise.all([
      countPostByStatus,
      countPostByTypeInMonthOfYear,
      countUserByIdentityVerified,
      countUserPerStatus,
      countSubscriptionPackage,
      getTop10UsersHaveMostPosts,
      countReportPerStatus,
      countBlog,
    ]);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Get dashboard successfully',
      result: {
        countPostByStatus: result[0],
        countPostByTypeInMonthOfYear: result[1],
        countUserByIdentityVerified: result[2],
        countUserPerStatus: result[3],
        countSubscriptionPackage: result[4],
        getTop10UsersHaveMostPosts: result[5],
        countReportPerStatus: result[6],
        countBlog: result[7],
      },
    };
    res.status(200).json(appRes);
  });
}

export default AdminController;
