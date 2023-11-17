import ServerCodes from '~/constants/server_codes';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { AppDataSource } from '~/app/database';
import { Service } from 'typedi';
import PostServices from '~/services/post.services';
@Service()
class AdminValidation {
  private postService: PostServices
  constructor(postService: PostServices) {
    this.postService = postService;
  }
  public readonly checkPostExisted = wrapRequestHandler(async (req: Request, res: Response, next) => {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: 'error',
        code: ServerCodes.AdminCode.MissingRequiredFields,
        message: 'Missing post_id in request body',
        result: null,
      });
    }
    const post = await this.postService.getPostById(id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        code: ServerCodes.AdminCode.NotFound,
        message: 'Post not found',
        result: null,
      });
    }
    req.post = post;
    next();
  });
}
export default AdminValidation;
