import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';

const router = Router();
router.route('/posts').get(AdminController.getPosts);
router.route('/posts/:id/approve').post(AdminController.approvePost);
router.route('/posts/:id/reject').post(AdminController.rejectPost);
router.route('/posts/:id/delete').post(AdminController.deletePost);

router.route('/users').get(AdminController.getUsers);

router.route('/developers').get(AdminController.getDevelopers)
    .post(AdminController.createDeveloper);
router.route('/developers/:id').patch(AdminController.updateDeveloper)
    .delete(AdminController.deleteDeveloper);

// Units
router.route('/units').get(AdminController.getUnits)
    .post(AdminController.createUnit);
router.route('/units/:id').patch(AdminController.updateUnit)
    .delete(AdminController.deleteUnit);

export default router;