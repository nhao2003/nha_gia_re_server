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
router.route('/').get(PostController.getAllPost);
router
  .route('/:id')
  .get(PostController.getPostById)
  .patch(AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.updatePost)
  .delete(AuthValidation.accessTokenValidation, PostValidation.checkPostExist, PostController.deletePost);

export default router;
