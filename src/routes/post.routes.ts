import { Router } from 'express';
import PostController from '~/controllers/post.controller';
import { PostValidation } from '~/middlewares/post.middleware';
import DependencyInjection from '../di/di';
import AuthValidation from '~/middlewares/auth.middleware';
const router = Router();

const postController = DependencyInjection.get<PostController>(PostController);
const postValidation = DependencyInjection.get<PostValidation>(PostValidation);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);

// Create a post
router
  .route('/create')
  .post(authValidation.accessTokenValidation, postValidation.createPostValidation, postController.createPost);
router
  .route('/:id')
  .get(authValidation.getUserByTokenIfExist, postController.getPostById)
  .patch(authValidation.accessTokenValidation, postValidation.checkPostExist, postController.updatePost)
  .delete(authValidation.accessTokenValidation, postValidation.checkPostExist, postController.deletePost);

//Mark read post
router
  .route('/mark-read/:id')
  .put(authValidation.accessTokenValidation, postValidation.checkPostExist, postController.markReadPost);
router
  .route('/favorite/:id')
  .put(authValidation.accessTokenValidation, postValidation.checkPostExist, postController.favoritePost);
router.route('/').get(authValidation.getUserByTokenIfExist, postController.getAllPost);
export default router;
