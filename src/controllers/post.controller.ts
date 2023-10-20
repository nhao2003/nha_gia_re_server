import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import PostServices from '../services/post.services';
import filterBody from '~/utils/filterBody';

class PostController {
  private generaRandomPic(count: number) {
    const pics = [];
    for (let i = 0; i < count; i++) {
      pics.push(`https://picsum.photos/seed/${Math.random() * 1001}/200/300`);
    }
    return pics;
  }
  createPost = wrapRequestHandler(async (req: any, res: any) => {
    let data = filterBody(req.body, [
      'type_id',
      'unit_id',
      'title',
      'description',
      'price',
      'desposit',
      'area',
      'address',
      'features',
      'is_lease',
      'is_pro_seller',
    ]);
    const images = this.generaRandomPic(5);
    const videos = ['https://www.youtube.com/watch?v=1y_kfWUCFDQ', 'https://www.youtube.com/watch?v=1y_kfWUCFDQ'];
    data = {
      ...data,
      "user_id": req.user.id,
      images,
      videos,
    };
    const post = await PostServices.createPost(data);
    res.status(200).json(post);
  });

  getAllPost = wrapRequestHandler(async (req: any, res: any) => {
    const post = await PostServices.getPosts(req.query.page);
    res.status(200).json(post);
  });

  getPostById = wrapRequestHandler(async (req: any, res: any) => {
    const post = await PostServices.getPostById(req.params.id);
    res.status(200).json(post);
  });
}

export default new PostController();
