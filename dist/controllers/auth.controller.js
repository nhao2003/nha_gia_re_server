"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const Error_1 = require("../models/Error");
const message_1 = require("../constants/message");
const enum_1 = require("../constants/enum");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const crypto_1 = require("../utils/crypto");
const typedi_1 = require("typedi");
const auth_service_1 = __importDefault(require("../services/auth.service"));
let AuthController = class AuthController {
    authServices;
    constructor(authServices) {
        this.authServices = authServices;
    }
    signUp = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, password } = req.body;
        const otp_code = await this.authServices.signUp(email, password);
        // await sendConfirmationEmail(email, token);
        res.status(200).json({
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SIGN_UP_SUCCESSFULLY,
            result: {
                otp_code,
            },
        });
    });
    //Resend Activation OTP Code
    resendActivationCode = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email } = req.body;
        const otp_code = await this.authServices.resendOTPCode(email);
        if (otp_code === null || otp_code === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        res.status(200).json({
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.RESEND_ACTIVATION_CODE_SUCCESSFULLY,
            result: {
                otp_code,
            },
        });
    });
    activeAccount = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, password, code } = req.body;
        const { user } = await this.authServices.getUserByEmailAndPassword(email, password);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
        }
        const verifyOTPCodes = await this.authServices.verifyOTPCodeAndUse(user.id, code, enum_1.OTPTypes.account_activation);
        if (verifyOTPCodes === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
        }
        const active = await this.authServices.activeAccount(user.id);
        if (active === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.YOUR_ACCOUNT_IS_ALREADY_ACTIVE, 404));
        }
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.ACTIVE_ACCOUNT_SUCCESSFULLY,
            result: {
                access_token,
                refresh_token,
            },
        };
        res.status(200).json(appRes);
    });
    signIn = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const user = req.user;
        // Create new session
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.SIGN_IN_SUCCESSFULLY,
            result: {
                access_token,
                refresh_token,
            },
        };
        res.status(200).json(appRes);
    });
    refreshToken = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { refresh_token } = req.body;
        const access_token = await this.authServices.grantNewAccessToken(refresh_token);
        if (access_token === null || access_token === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.REFRESH_TOKEN_IS_EXPIRED_OR_INVALID, 401));
        }
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.RENEW_ACCESS_TOKEN_SUCCESSFULLY,
            result: {
                access_token,
            },
        };
        res.status(200).json(appRes);
    });
    signOut = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        await this.authServices.signOut(req.session.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_SUCCESSFULLY,
        };
        res.status(200).json(appRes);
    });
    signOutAll = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        await this.authServices.signOutAll(req.session.user_id);
        // res.status(200).json({
        //   status: 'success',
        //   message: APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
        // });
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
        };
        res.status(200).json(appRes);
    });
    changePassword = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { old_password, new_password } = req.body;
        const user = req.user;
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        const isMatch = (0, crypto_1.verifyPassword)(old_password, user.password);
        if (!isMatch) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_PASSWORD, 400));
        }
        await this.authServices.changePassword(user.id, new_password);
        // Sign out all session
        await this.authServices.signOutAll(user.id);
        // Create new session
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY,
            result: {
                access_token,
                refresh_token,
            },
        };
        res.status(200).json(appRes);
    });
    forgotPassword = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email } = req.body;
        const otp_code = await this.authServices.forgetPassword(email);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY,
            result: {
                otp_code,
            },
        };
        res.status(200).json(appRes);
    });
    verifyRecoveryPasswordOTP = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, code } = req.body;
        const user = await this.authServices.checkUserExistByEmail(email);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        const verifyOTPCodes = await this.authServices.getOTP(user.id, code, enum_1.OTPTypes.password_recovery);
        if (verifyOTPCodes === null) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
        }
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.OTP_CODE_IS_CORRECT,
        };
        res.status(200).json(appRes);
    });
    resetPassword = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, code, new_password } = req.body;
        const user = await this.authServices.checkUserExistByEmail(email);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        const verifyOTPCodes = await this.authServices.verifyOTPCodeAndUse(user.id, code, enum_1.OTPTypes.password_recovery);
        if (verifyOTPCodes === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
        }
        await this.authServices.changePassword(user.id, new_password);
        // Sign out all session
        await this.authServices.signOutAll(user.id);
        // Create new session
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.RESET_PASSWORD_SUCCESSFULLY,
            result: {
                access_token,
                refresh_token,
            },
        };
        res.status(200).json(appRes);
    });
};
AuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [auth_service_1.default])
], AuthController);
exports.default = AuthController;
