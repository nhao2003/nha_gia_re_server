import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import PostServices from '~/services/post.services';
import UserServices from '~/services/user.services';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { buildBaseQuery, buildOrder, buildQuery } from '~/utils/build_query';
import { BaseQuery } from '~/models/PostQuery';
import CommonServices from '~/services/common.services';
import { Unit } from '~/domain/databases/entity/Unit';
import { Developer } from '~/domain/databases/entity/Developer';
import { PropertyType } from '~/domain/databases/entity/PropertyType';

class AdminController {
  private UnitsService = new CommonServices(Unit);
  private DeveloperService = new CommonServices(Developer);
  private PropertyTypeService = new CommonServices(PropertyType);
  public readonly getUnits = wrapRequestHandler(async (req: Request, res: Response) => {
    const baseQuery = buildBaseQuery(req.query);
    const data = await this.UnitsService.getAllByQuery(baseQuery);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'APP_MESSAGES.SUCCESS_MESSAGE.GET_UNIT_INFO_SUCCESSFULLY',
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
    // return res.json(posts);

    const appRes = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
      result: posts,
    };
    res.status(200).json(appRes);
  });

  public readonly approvePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.approvePost(id);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.APPROVE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly rejectPost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await AdminService.rejectPost(id, reason);
    // return res.json(result);

    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.REJECT_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deletePost(id);
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

    const appRes = {
      status: 'success',
      code: ServerCodes.UserCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
      result: users,
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
      result: developers,
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
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
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
      name: req.body.name
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

}

export default new AdminController();
