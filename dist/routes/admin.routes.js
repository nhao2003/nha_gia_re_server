"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const admin_middlewares_1 = __importDefault(require("../middlewares/admin.middlewares"));
const di_1 = __importDefault(require("../di/di"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const blog_controller_1 = __importDefault(require("../controllers/blog.controller"));
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
const router = (0, express_1.Router)();
const adminController = di_1.default.get(admin_controller_1.default);
const adminValidation = di_1.default.get(admin_middlewares_1.default);
const projectController = di_1.default.get(project_controller_1.default);
const blogController = di_1.default.get(blog_controller_1.default);
const reportController = di_1.default.get(report_controller_1.default);
router.route('/posts').get(adminController.getPosts);
router.route('/posts/approve').post(adminValidation.checkPostExisted, adminController.approvePost);
router.route('/posts/reject').post(adminValidation.checkPostExisted, adminController.rejectPost);
router.route('/posts/delete').patch(adminValidation.checkPostExisted, adminController.deletePost);
router.route('/users').get(adminController.getUsers);
router.route('/users/:id/ban').patch(adminController.banUser);
router.route('/users/:id/unban').patch(adminController.unbanUser);
router.route('/developers').get(adminController.getDevelopers).post(adminController.createDeveloper);
router.route('/developers/:id').patch(adminController.updateDeveloper).delete(adminController.deleteDeveloper);
// Units
router.route('/units').get(adminController.getUnits).post(adminController.createUnit);
router.route('/units/:id').patch(adminController.updateUnit).delete(adminController.deleteUnit);
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
// MembemshipPackages
router
    .route('/membership-packages')
    .get(adminController.getMembershipPackages)
    .post(adminController.createMembershipPackage);
router
    .route('/membership-packages/:id')
    // .patch(AdminController.updateMembershipPackage)
    .delete(adminController.deleteMembershipPackage);
// Discount Codes
router.route('/discount-codes').get(adminController.getDiscountCodes).post(adminController.createDiscountCode);
router
    .route('/discount-codes/:id')
    // .patch(AdminController.updateDiscountCode)
    .delete(adminController.deleteDiscountCode);
// Get all reports
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);
// Blogs
router.route('/blogs').get(blogController.getAllBlog).post(blogController.createBlog);
router.route('/blogs/:id').patch(blogController.updateBlog).delete(blogController.deleteBlog);
router.route('/blogs/:id/view').get(blogController.viewBlog);
exports.default = router;
