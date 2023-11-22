"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const di_1 = __importDefault(require("../di/di"));
const authController = di_1.default.get(auth_controller_1.default);
const authValidation = di_1.default.get(auth_middleware_1.default);
const router = (0, express_1.Router)();
router.route('/sign-up').post(authValidation.signUpValidation, authController.signUp);
router.route('/active-account').get(authValidation.acctiveAccountValidation, authController.activeAccount);
router.route('/resend-activation-code').post(authValidation.resendActivationCodeValidation, authController.resendActivationCode);
router.route('/sign-in').post(authValidation.signInValidation, authController.signIn);
router.route('/refresh-token').get(authValidation.refreshTokenValidation, authController.refreshToken);
router.route('/change-password').post(authValidation.accessTokenValidation, authController.changePassword);
router.route('/forgot-password').post(authValidation.forgotPasswordValidation, authController.forgotPassword);
router
    .route('/verify-forgot-password-otp')
    .get(authValidation.verifyRecoveryTokenValidation, authController.verifyRecoveryPasswordOTP);
router.route('/reset-password').post(authValidation.resetPasswordValidation, authController.resetPassword);
router.route('/sign-out').post(authValidation.accessTokenValidation, authController.signOut);
router.route('/sign-out-all').post(authValidation.accessTokenValidation, authController.signOutAll);
exports.default = router;
