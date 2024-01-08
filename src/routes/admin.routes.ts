import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import AuthValidation from '~/middlewares/auth.middleware';
import AdminValidation from '~/middlewares/admin.middlewares';
import DependencyInjection from '~/di/di';
import ProjectController from '~/controllers/project.controller';
import BlogController from '~/controllers/blog.controller';
import ReportController from '~/controllers/report.controller';
import AccountVerificationRequestController from '~/controllers/account_verification_request.controller';
const router = Router();
const adminController = DependencyInjection.get<AdminController>(AdminController);
const adminValidation = DependencyInjection.get<AdminValidation>(AdminValidation);
const projectController = DependencyInjection.get<ProjectController>(ProjectController);
const blogController = DependencyInjection.get<BlogController>(BlogController);
const reportController = DependencyInjection.get<ReportController>(ReportController);
const accountVerificationRequestController = DependencyInjection.get<AccountVerificationRequestController>(
  AccountVerificationRequestController,
);
router.route('/posts').get(adminController.getPosts);
router.route('/posts/approve').post(adminValidation.checkPostExisted, adminController.approvePost);
router.route('/posts/reject').post(adminValidation.checkPostExisted, adminController.rejectPost);
router.route('/posts/delete').patch(adminValidation.checkPostExisted, adminController.deletePost);
router.route('/posts/dashboard').get(adminController.dashboard);

router.route('/users').get(adminController.getUsers);
router.route('/users/:id/ban').patch(adminController.banUser);
router.route('/users/:id/unban').patch(adminController.unbanUser);

router.route('/developers').get(adminController.getDevelopers).post(adminController.createDeveloper);
router.route('/developers/:id').patch(adminController.updateDeveloper).delete(adminController.deleteDeveloper);

//PropertyTypes
router.route('/property-types').get(adminController.getPropertyTypes).post(adminController.createPropertyType);
router
  .route('/property-types/:id')
  .patch(adminController.updatePropertyType)
  .delete(adminController.deletePropertyType);

//Projects
// router.route('/projects').get(projectController.getProjects).post(projectController.createProject);

// router.route('/projects/:id').patch(projectController.updateProject);

router
  .route('/projects')
  .get(projectController.getProjects)
  .post(projectController.createProject)
  .delete(projectController.deleteProject);

router.route('/projects/:id').patch(projectController.updateProject).delete(projectController.deleteProject);

// MembemshipPackages
router
  .route('/membership-packages')
  .get(adminController.getMembershipPackages)
  .post(adminController.createMembershipPackage);
router
  .route('/membership-packages/:id')
  .patch(adminController.updateMembershipPackage)
  .delete(adminController.deleteMembershipPackage);

// Discount Codes
router.route('/discount-codes').get(adminController.getDiscountCodes).post(adminController.createDiscountCode);
router.route('/discount-codes/:id').get(adminController.getDiscountCodeById).delete(adminController.deleteDiscountCode);

// Get all reports
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);

// Blogs
router.route('/blogs').get(blogController.getAllBlog).post(blogController.createBlog);
router.route('/blogs/:id').patch(blogController.updateBlog).delete(blogController.deleteBlog);
router.route('/blogs/:id/view').get(blogController.viewBlog);

// Account Verification Requests
router.route('/account-verification-requests').get(accountVerificationRequestController.getAllByQuery);
router.route('/account-verification-requests/:id').patch(accountVerificationRequestController.updateRequest);

export default router;
