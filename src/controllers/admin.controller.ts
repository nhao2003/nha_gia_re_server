import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import PostServices from '~/services/post.services';
import UserServices from '~/services/user.services';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

class AdminController {

  public readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = PostServices.buildPostQuery(req.query);
    const posts = await PostServices.getPostsByQuery(query, req.user?.id);
    return res.json(posts);
  });

  public readonly approvePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.approvePost(id);
    return res.json(result);
  });

  public readonly rejectPost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await AdminService.rejectPost(id, reason);
    return res.json(result);
  });

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deletePost(id);
    return res.json(result);
  });

  public readonly getUsers = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = UserServices.buildUserQuery(req.query);
    const users = await UserServices.getUserByQuery(query);
    return res.json(users);
  });
}

export default new AdminController();
