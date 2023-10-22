"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const Error_1 = require("../models/Error");
const message_1 = require("../constants/message");
const enum_1 = require("../constants/enum");
const auth_services_1 = __importDefault(require("../services/auth.services"));
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const crypto_1 = require("../utils/crypto");
class AuthController {
    authServices;
    constructor() {
        this.authServices = new auth_services_1.default();
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
    activeAccount = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, password, code } = req.body;
        const user = await this.authServices.getUserByEmailAndPassword(email, password);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
        }
        const verifyOTPCodes = await this.authServices.verifyOTPCode(user.id, code, enum_1.OTPTypes.account_activation);
        if (verifyOTPCodes === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
        }
        const active = await this.authServices.activeAccount(user.id);
        if (active === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.YOUR_ACCOUNT_IS_ALREADY_ACTIVE, 404));
        }
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        res.status(200).json({
            status: 'success',
            result: {
                access_token,
                refresh_token,
            },
        });
    });
    signIn = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this.authServices.getUserByEmailAndPassword(email, password);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 404));
        }
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        res.status(200).json({
            status: 'success',
            result: {
                access_token,
                refresh_token,
            }
        });
    });
    refreshToken = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { refresh_token } = req.body;
        const access_token = await this.authServices.grantNewAccessToken(refresh_token);
        if (access_token === null || access_token === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.REFRESH_TOKEN_IS_EXPIRED_OR_INVALID, 401));
        }
        res.status(200).json({
            status: 'success',
            result: {
                access_token,
            },
        });
    });
    signOut = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        await this.authServices.signOut(req.session.id);
        res.status(200).json({
            status: 'success',
            message: message_1.APP_MESSAGES.SIGN_OUT_SUCCESSFULLY,
        });
    });
    signOutAll = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        await this.authServices.signOutAll(req.session.user_id);
        res.status(200).json({
            status: 'success',
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.SIGN_OUT_ALL_SUCCESSFULLY,
        });
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
        res.status(200).json({
            status: 'success',
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY,
        });
    });
    forgotPassword = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email } = req.body;
        const otp_code = await this.authServices.forgetPassword(email);
        res.status(200).json({
            status: 'success',
            code: server_codes_1.default.AuthCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY,
            result: {
                otp_code,
            },
        });
    });
    verifyForgotPassword = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { email, code } = req.body;
        const user = await this.authServices.checkUserExistByEmail(email);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        const verifyOTPCodes = await this.authServices.verifyOTPCode(user.id, code, enum_1.OTPTypes.password_recovery);
        if (verifyOTPCodes === false) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.ERROR_MESSAGE.OTP_CODE_IS_INCORRECT_OR_EXPIRED, 404));
        }
        await this.authServices.signOutAll(user.id);
        const { access_token, refresh_token } = await this.authServices.createSession(user.id);
        res.status(200).json({
            status: 'success',
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.YOUR_ACCOUNT_HAS_BEEN_SIGN_OUT_ON_ALL_DEVICES_YOU_CAN_CHANGE_PASSWORD_NOW,
            result: {
                access_token,
                refresh_token,
            },
        });
    });
}
exports.default = new AuthController();
