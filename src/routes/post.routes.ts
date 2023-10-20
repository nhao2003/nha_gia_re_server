import { Router } from 'express';
import { AuthValidation } from '~/middlewares/auth.middleware';
import { UserValidation } from '~/middlewares/user.middlware';
import PostController from '~/controllers/post.controller';
const router = Router();

// Create a post
router
  .route('/create')
  .post(AuthValidation.accessTokenValidation, PostController.createPost);
// router.route(':/id').get(UserValidation.getPostValidation, userControllers.getPost)
// .patch(AuthValidation.accessTokenValidation, UserValidation.updatePostValidation, userControllers.updatePost)
// .delete(AuthValidation.accessTokenValidation, UserValidation.deletePostValidation, userControllers.deletePost);


export default router;
