"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_middlware_1 = require("../middlewares/user.middlware");
const di_1 = __importDefault(require("../di/di"));
const router = (0, express_1.Router)();
const authValidation = di_1.default.get(auth_middleware_1.default);
const userValidation = di_1.default.get(user_middlware_1.UserValidation);
const userControllers = di_1.default.get(user_controller_1.default);
router
    .route('/update-profile')
    .patch(authValidation.accessTokenValidation, userValidation.updateProfileValidation, userControllers.updateProfile);
router.route('/profile').get(authValidation.accessTokenValidation, userControllers.getUserProfile);
router.route('/:id').get(userValidation.getUserProfileValidation, userControllers.getUserProfile);
exports.default = router;
