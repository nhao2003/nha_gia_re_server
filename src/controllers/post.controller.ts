import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import PostServices from '../services/post.services';
import filterBody from '~/utils/filterBody';
import { PropertyFeatures } from '~/domain/typing/Features';
import Address from '~/domain/typing/address';
import CreatePost from '~/models/Request/CreatePost';

class PostController {
  private generaRandomPic(count: number) {
    const pics = [];
    for (let i = 0; i < count; i++) {
      pics.push(`https://picsum.photos/seed/${Math.random() * 1001}/200/300`);
    }
    return pics;
  }
  createPost = wrapRequestHandler(async (req: any, res: any) => {
    // let data = filterBody(req.body, [
    //   'type_id',
    //   'unit_id',
    //   'title',
    //   'description',
    //   'price',
    //   'desposit',
    //   'area',
    //   'is_lease',
    //   'is_pro_seller',
    //   'images',
    //   'videos',
    // ]);
    // data = {
    //   ...data,
    //   address: Address.fromJSON(req.body.address),
    //   features: PropertyFeatures.fromJson({
    //     type_id: req.body.type_id,
    //     ...req.body.features,
    //   }),
    //   user_id: req.user.id,
    // };
    const data: CreatePost = {
      type_id: req.body.type_id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      desposit: req.body.desposit,
      area: req.body.area,
      is_lease: req.body.is_lease,
      is_pro_seller: req.body.is_pro_seller,
      images: req.body.images,
      videos: req.body.videos.length > 0 ? req.body.videos : null,
      address: Address.fromJSON(req.body.address),
      features: PropertyFeatures.fromJson({
        type_id: req.body.type_id,
        ...req.body.features,
      }),
      user_id: req.user.id,
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
