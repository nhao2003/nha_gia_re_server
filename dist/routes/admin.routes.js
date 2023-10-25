"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
router.route('/posts').get(admin_controller_1.default.getPosts);
router.route('/posts/:id/approve').post(admin_controller_1.default.approvePost);
router.route('/posts/:id/reject').post(admin_controller_1.default.rejectPost);
router.route('/posts/:id/delete').post(admin_controller_1.default.deletePost);
router.route('/users').get(admin_controller_1.default.getUsers);
exports.default = router;
