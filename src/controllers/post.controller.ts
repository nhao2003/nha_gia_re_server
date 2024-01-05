import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import PostServices from '../services/post.service';
import { PropertyFeatures } from '~/domain/typing/Features';
import Address from '~/domain/typing/address';
import CreatePost from '~/models/Request/CreatePost';
import UpdatePostRequest from '~/models/Request/UpdatePostRequest';
import { AppError } from '~/models/Error';
import { NextFunction } from 'express';
import AppResponse from '~/models/AppRespone';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import { Request, Response } from 'express';
import { Service } from 'typedi';

@Service()
class PostController {
  private postServices: PostServices;

  constructor(postServices: PostServices) {
    this.postServices = postServices;
  }
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
      project: req.body.project,
    };
    const post = await this.postServices.createPost(data);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
      result: post,
    };
    res.status(200).json(appRes);
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
      project: req.body.project,
    };
    const updatedPost = await this.postServices.updatePost(req.params.id, data);
    // res.status(200).json(updatedPost);

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_POST_SUCCESSFULLY,
      result: updatedPost,
    };
    res.status(200).json(appRes);
  });

  deletePost = wrapRequestHandler(async (req: any, res: any, next: NextFunction) => {
    const post = req.post;
    if (post.is_active === false) {
      return next(new AppError('Post is already deleted', 400));
    }
    await this.postServices.deletePost(req.params.id);
    // res.status(200).json({ message: 'Delete success' });

    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
    };
    res.status(200).json(appRes);
  });

  getAllPost = wrapRequestHandler(async (req: any, res: any) => {
    const query = this.postServices.buildPostQuery(req.query);
    const posts = await this.postServices.getPostsByQuery(query, req.user?.id);
    // return res.json(posts);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
      num_of_pages: posts.numberOfPages,
      result: posts.data,
    };
    res.status(200).json(appRes);
  });

  getPostById = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const query: {
      [key: string]: any;
    } = {
      'post.id[eq]': `'` + id + `'`,
      'post.expiry_date[gte]': `'${new Date().toJSON()}'`,
      'post.is_active[eq]': 'eq:true',
      'user.status[eq]': "'verified'",
    };
    const postQuery = this.postServices.buildPostQuery(query);
    const { data, numberOfPages } = await this.postServices.getPostsByQuery(postQuery, req.user ? req.user.id : null);
    let appRes: AppResponse;

    if (data.length === 0) {
      appRes = {
        status: 'fail',
        code: ServerCodes.PostCode.PostNotFound,
        message: APP_MESSAGES.POST_NOT_FOUND,
      };
      return res.status(404).json(appRes);
    } else {
      appRes = {
        status: 'success',
        code: ServerCodes.PostCode.Success,
        message: APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
        result: data,
      };
      return res.status(200).json(appRes);
    }
  });

  // Mark read post
  markReadPost = wrapRequestHandler(async (req: any, res: any) => {
    const id = req.params.id;
    const post = await this.postServices.markReadPost(id, req.user.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: APP_MESSAGES.SUCCESS_MESSAGE.MARK_READ_POST_SUCCESSFULLY,
      result: post,
    };
    res.status(200).json(appRes);
  });

  // Favorite post
  favoritePost = wrapRequestHandler(async (req: any, res: any) => {
    const id = req.params.id;
    const post = await this.postServices.toggleFavorite(req.user.id, id);

    if (post === false) {
      const appRes: AppResponse = {
        status: 'success',
        code: ServerCodes.PostCode.Success,
        message: APP_MESSAGES.SUCCESS_MESSAGE.UNFAVORITE_POST_SUCCESSFULLY,
      };
      res.status(200).json(appRes);
    } else {
      const appRes: AppResponse = {
        status: 'success',
        code: ServerCodes.PostCode.Success,
        message: APP_MESSAGES.SUCCESS_MESSAGE.FAVORITE_POST_SUCCESSFULLY,
      };
      res.status(200).json(appRes);
    }
  });

  checkLimitPost = wrapRequestHandler(async (req: any, res: any) => {
    const limit = await this.postServices.checkLimitPostInMonth(req.user.id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: 'Check limit post successfully',
      result: limit,
    };
    res.status(200).json(appRes);
  });

  // Get favorite post
  getFavoritePost = wrapRequestHandler(async (req: any, res: any) => {
    const user_id = req.user.id;
    let { page } = req.query;
    page = isNaN(Number(page)) ? 1 : Number(page);
    const posts = await this.postServices.getFavoritePostsByUserId(user_id, page);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.PostCode.Success,
      message: 'Get favorite post successfully',
      num_of_pages: posts.numberOfPages,
      result: posts.data,
    };
    res.status(200).json(appRes);
  });
}

export default PostController;
