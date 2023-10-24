import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';

const router = Router();

router.route('/posts').get(AdminController.getPosts);
router.route('/posts/:id/approve').post(AdminController.approvePost);
router.route('/posts/:id/reject').post(AdminController.rejectPost);
router.route('/posts/:id/delete').post(AdminController.deletePost);

export default router;