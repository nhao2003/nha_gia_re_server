import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import projectController from '~/controllers/project.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';

const router = Router();
router.route('/posts').get(AdminController.getPosts);
router.route('/posts/:id/approve').post(AdminController.approvePost);
router.route('/posts/:id/reject').post(AdminController.rejectPost);
router.route('/posts/:id/delete').post(AdminController.deletePost);

router.route('/users').get(AdminController.getUsers);

router.route('/developers').get(AdminController.getDevelopers).post(AdminController.createDeveloper);
router.route('/developers/:id').patch(AdminController.updateDeveloper).delete(AdminController.deleteDeveloper);

// Units
router.route('/units').get(AdminController.getUnits).post(AdminController.createUnit);
router.route('/units/:id').patch(AdminController.updateUnit).delete(AdminController.deleteUnit);

//PropertyTypes
router.route('/property-types').get(AdminController.getPropertyTypes).post(AdminController.createPropertyType);
router
  .route('/property-types/:id')
  .patch(AdminController.updatePropertyType)
  .delete(AdminController.deletePropertyType);

//Projects
router.route('/projects').get(projectController.getProjects).post(projectController.createProject);

router.route('/projects/:id').patch(projectController.updateProject);


// MembemshipPackages
router.route('/membership-packages').get(AdminController.getMembershipPackages).post(AdminController.createMembershipPackage);
router
  .route('/membership-packages/:id')
  // .patch(AdminController.updateMembershipPackage)
  .delete(AdminController.deleteMembershipPackage);

// Discount Codes
router.route('/discount-codes').get(AdminController.getDiscountCodes).post(AdminController.createDiscountCode);
router
  .route('/discount-codes/:id')
  // .patch(AdminController.updateDiscountCode)
  .delete(AdminController.deleteDiscountCode);


export default router;
