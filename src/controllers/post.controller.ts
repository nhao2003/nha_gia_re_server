import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import PostServices from '../services/post.services';
import filterBody from '~/utils/filterBody';
import { PropertyFeatures } from '~/domain/typing/Features';
import Address from '~/domain/typing/address';
import CreatePost from '~/models/Request/CreatePost';
import UpdatePostRequest from '~/models/Request/UpdatePostRequest';
import { AppError } from '~/models/Error';
import { NextFunction } from 'express';

class PostController {
  createPost = wrapRequestHandler(async (req: any, res: any) => {
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
      videos: Array.isArray(req.body.videos) && req.body.videos.length > 0 ? req.body.videos : null,
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
  updatePost = wrapRequestHandler(async (req: any, res: any) => {
    const post = req.post;
    const data: UpdatePostRequest = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      desposit: req.body.desposit,
      area: req.body.area,
      is_lease: req.body.is_lease,
      is_pro_seller: req.body.is_pro_seller,
      images: req.body.images,
      videos: Array.isArray(req.body.videos) && req.body.videos.length ? req.body.videos : null,
      address: Address.fromJSON(req.body.address),
      features: PropertyFeatures.fromJson({
        type_id: req.body.type_id,
        ...req.body.features,
      }),
    };
    const updatedPost = await PostServices.updatePost(req.params.id, data);
    res.status(200).json(updatedPost);
  });

  deletePost = wrapRequestHandler(async (req: any, res: any, next: NextFunction) => {
    const post = req.post;
    if (post.is_active === false) {
      return next(new AppError('Post is already deleted', 400));
    }
    await PostServices.deletePost(req.params.id);
    res.status(200).json({ message: 'Delete success' });
  });

  getAllPost = wrapRequestHandler(async (req: any, res: any) => {
    const post = await PostServices.getPosts(req.query.page);
    res.status(200).json(post);
  });

  getPostById = wrapRequestHandler(async (req: any, res: any) => {
    const id = req.params.id;
    const post = await PostServices.getPostById(id);
    res.status(200).json(post);
  });
}

export default new PostController();
