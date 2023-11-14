import { Router } from 'express';
import { AuthValidation } from '~/middlewares/auth.middleware';
import { UserValidation } from '~/middlewares/user.middlware';
import PostController from '~/controllers/post.controller';
import { PostValidation } from '~/middlewares/post.middleware';
const router = Router();

// Create a post
router
  .route('/create')
  .post(AuthValidation.accessTokenValidation, PostValidation.createPostValidation, PostController.createPost);
router
  .route('/:id')
  .get(AuthValidation.getUserByTokenIfExist, PostController.getPostById)
  .patch(AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.updatePost)
  .delete(AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.deletePost);

//Mark read post
router
  .route('/mark-read/:id')
  .put(AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.markReadPost);
router
  .route('/favorite/:id')
  .put( AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.favoritePost);
router.route('/').get(AuthValidation.getUserByTokenIfExist,PostController.getAllPost);
export default router;
