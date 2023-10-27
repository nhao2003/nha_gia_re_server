import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { BaseQuery } from '~/models/PostQuery';
class DeveloperController {
  public readonly getDevelopers = wrapRequestHandler(async (req: Request, res: Response) => {
    const where = buildQuery(req.query);
    const sort_fields = req.query.sort_fields as string;
    const sort_orders = req.query.sort_orders as string | null;
    const order = buildOrder(sort_fields, sort_orders);
    const query: BaseQuery = {
      page: Number(req.query.page) || 1,
      wheres: where,
      orders: order,
    };
    const developers = await AdminService.getDeveloperByQuery(query);
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
    const developer = await AdminService.createDeveloper(data);
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
    const result = await AdminService.updateDeveloper(id, data);
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
    const result = await AdminService.updateDeveloper(id, { is_active: false });
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
      result: result,
    };
    res.status(200).json(appRes);
  });
}
export default new DeveloperController();
