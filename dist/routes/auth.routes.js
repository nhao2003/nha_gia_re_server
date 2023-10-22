"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/sign-up').post(auth_middleware_1.AuthValidation.signUpValidation, auth_controller_1.default.signUp);
router.route('/active-account').get(auth_middleware_1.AuthValidation.acctiveAccountValidation, auth_controller_1.default.activeAccount);
router.route('/sign-in').post(auth_middleware_1.AuthValidation.signInValidation, auth_controller_1.default.signIn);
router.route('/refresh-token').get(auth_middleware_1.AuthValidation.refreshTokenValidation, auth_controller_1.default.refreshToken);
router.route('/change-password').post(auth_middleware_1.AuthValidation.accessTokenValidation, auth_controller_1.default.changePassword);
router.route('/forgot-password').post(auth_middleware_1.AuthValidation.forgotPasswordValidation, auth_controller_1.default.forgotPassword);
router
    .route('/verify-forgot-password')
    .get(auth_middleware_1.AuthValidation.verifyRecoveryTokenValidation, auth_controller_1.default.verifyForgotPassword);
router.route('/sign-out').post(auth_middleware_1.AuthValidation.accessTokenValidation, auth_controller_1.default.signOut);
router.route('/sign-out-all').post(auth_middleware_1.AuthValidation.accessTokenValidation, auth_controller_1.default.signOutAll);
exports.default = router;
