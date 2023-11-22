"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const post_middleware_1 = require("../middlewares/post.middleware");
const di_1 = __importDefault(require("../di/di"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
const postController = di_1.default.get(post_controller_1.default);
const postValidation = di_1.default.get(post_middleware_1.PostValidation);
const authValidation = di_1.default.get(auth_middleware_1.default);
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
exports.default = router;
