"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const post_middleware_1 = require("../middlewares/post.middleware");
const router = (0, express_1.Router)();
// Create a post
router
    .route('/create')
    .post(auth_middleware_1.AuthValidation.accessTokenValidation, post_middleware_1.PostValidation.createPostValidation, post_controller_1.default.createPost);
router.route('/').get(post_controller_1.default.getAllPost);
router
    .route('/:id')
    .get(post_controller_1.default.getPostById)
    .patch(auth_middleware_1.AuthValidation.accessTokenValidation, post_middleware_1.PostValidation.checkPostExist, post_controller_1.default.updatePost)
    .delete(auth_middleware_1.AuthValidation.accessTokenValidation, post_middleware_1.PostValidation.checkPostExist, post_controller_1.default.deletePost);
exports.default = router;
