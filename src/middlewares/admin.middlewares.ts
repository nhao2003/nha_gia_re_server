import ServerCodes from '~/constants/server_codes';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import PostService from '~/services/post.services';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
class AdminValidation {
  private postRepo: Repository<RealEstatePost>;
  constructor() {
    this.postRepo = RealEstatePost.getRepository();
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
    const post = await this.postRepo
      .createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('is_active = :is_active', { is_active: true })
      .setParameters({ current_user_id: null })
      .getOne();
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
export default new AdminValidation();
