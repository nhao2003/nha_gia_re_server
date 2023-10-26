import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';

const router = Router();

router.route('/posts').get(AuthValidation.accessTokenValidation, AdminController.getPosts);
router.route('/posts/:id/approve').post(AdminController.approvePost);
router.route('/posts/:id/reject').post(AdminController.rejectPost);
router.route('/posts/:id/delete').post(AdminController.deletePost);

router.route('/users').get(AdminController.getUsers);

export default router;