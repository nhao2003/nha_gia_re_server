"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("../controllers/blog.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const di_1 = __importDefault(require("../di/di"));
const blogController = di_1.default.get(blog_controller_1.default);
const authValidation = di_1.default.get(auth_middleware_1.default);
const router = (0, express_1.Router)();
router.get('/', authValidation.getUserByTokenIfExist, blogController.getAllBlog);
router.get('/:id', authValidation.getUserByTokenIfExist, blogController.getBlogById);
exports.default = router;
