import ProjectServices from '~/services/project.services';
import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { Request, Response } from 'express';
import AppResponse from '~/models/AppRespone';
import { Service } from 'typedi';

@Service()
class ProjectController {
  private projectServices: ProjectServices;

  constructor(projectServices: ProjectServices) {
    this.projectServices = projectServices;
  }

  public readonly getProjects = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const projects = await this.projectServices.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_PROJECT_SUCCESSFULLY,
      num_of_pages: projects.num_of_pages,
      result: projects.data,
    };
    res.status(200).json(appRes);
  });

  public readonly createProject = wrapRequestHandler(async (req: Request, res: Response) => {
    //TODO: validate scales and types
    const data = req.body;
    const project = await this.projectServices.create(data);
    const appRes: AppResponse = {
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
    const project = await this.projectServices.update(id, data);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_PROJECT_SUCCESSFULLY,
      result: project,
    };
    res.status(200).json(appRes);
  });

  public readonly deleteProject = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const project = await this.projectServices.markDeleted(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.AdminCode.Success,
      message: 'Delete project successfully',
      result: project,
    };
    res.status(200).json(appRes);
  });
}

export default ProjectController;
