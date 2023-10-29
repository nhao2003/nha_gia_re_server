import ProjectServices from '~/services/project.services';
import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { Request, Response } from 'express';
class ProjectController {
  public readonly getProjects = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const projects = await ProjectServices.getAllByQuery(query);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_PROJECT_SUCCESSFULLY,
      result: projects,
    };
    res.status(200).json(appRes);
  });

  public readonly createProject = wrapRequestHandler(async (req: Request, res: Response) => {
    //TODO: validate scales and types
    const data = req.body;
    const project = await ProjectServices.create(data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_PROJECT_SUCCESSFULLY,
      result: project,
    };
    res.status(200).json(appRes);
  });

  public readonly updateProject = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const project = await ProjectServices.update(id, data);
    const appRes = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_PROJECT_SUCCESSFULLY,
      result: project,
    };
    res.status(200).json(appRes);
  });
}

export default new ProjectController();