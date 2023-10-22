"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_middlware_1 = require("../middlewares/user.middlware");
const router = (0, express_1.Router)();
router
    .route('/update-profile')
    .patch(auth_middleware_1.AuthValidation.accessTokenValidation, user_middlware_1.UserValidation.updateProfileValidation, user_controller_1.default.updateProfile);
router.route('/profile').get(auth_middleware_1.AuthValidation.accessTokenValidation, user_controller_1.default.getUserProfile);
router.route('/:id').get(user_middlware_1.UserValidation.getUserProfileValidation, user_controller_1.default.getUserProfile);
exports.default = router;
