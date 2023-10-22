"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.protect = exports.tokenValidation = exports.AuthValidation = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const message_1 = require("../constants/message");
const Error_1 = require("../models/Error");
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const crypto_1 = require("../utils/crypto");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const enum_1 = require("../constants/enum");
const User_1 = require("../domain/databases/entity/User");
const params_validation_1 = require("../validations/params_validation");
const auth_services_1 = __importDefault(require("../services/auth.services"));
const server_codes_1 = __importDefault(require("../constants/server_codes"));
class AuthValidation {
    static signUpValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
            email: params_validation_1.ParamsValidation.email,
            password: params_validation_1.ParamsValidation.password,
            confirmPassword: {
                ...params_validation_1.ParamsValidation.password,
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error_1.AppError(message_1.APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
                        }
                        return true;
                    },
                },
            },
        })),
        async (req, res, next) => {
            const { email, password } = req.body;
            const userService = new auth_services_1.default();
            const user = await userService.checkUserExistByEmail(email);
            if (user) {
                return res.status(httpStatus_1.default.CONFLICT).json({
                    status: 'error',
                    code: server_codes_1.default.AuthCode.EMAIL_ALREADY_EXISTS,
                    message: message_1.APP_MESSAGES.ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
                });
            }
            next();
        },
    ];
    static signInValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
            email: params_validation_1.ParamsValidation.email,
            password: params_validation_1.ParamsValidation.password,
        })),
        async (req, res, next) => {
            const { email, password } = req.body;
            const userService = new auth_services_1.default();
            const user = await userService.checkUserExistByEmail(email);
            if (user === undefined || user === null) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
            }
            if (user.status === enum_1.UserStatus.unverified) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_VERIFIED, 401));
            }
            const isMatch = (0, crypto_1.verifyPassword)(password, user.password);
            if (!isMatch) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 400));
            }
            next();
        },
    ];
    static acctiveAccountValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
        password: params_validation_1.ParamsValidation.password,
        code: params_validation_1.ParamsValidation.code,
    }));
    static accessTokenValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
            Authorization: {
                in: ['headers'],
                notEmpty: {
                    errorMessage: message_1.APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                },
                trim: true,
            },
        })),
        async (req, res, next) => {
            const authorization = req.headers.authorization;
            const access_token = authorization?.split(' ')[1];
            if (!access_token) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, httpStatus_1.default.UNAUTHORIZED));
            }
            const result = await (0, jwt_1.verifyToken)(access_token, process.env.JWT_SECRET_KEY);
            if (!result) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, httpStatus_1.default.UNAUTHORIZED));
            }
            if (result.expired || !result.payload) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
            }
            const authServices = new auth_services_1.default();
            const session = await authServices.checkSessionExist(result.payload.session_id);
            if (session === null || session === undefined) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
            }
            const user = await authServices.checkUserExistByID(session.user_id);
            if (user === null || user === undefined) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
            }
            req.user = user;
            req.session = session;
            next();
        },
    ];
    static refreshTokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        refresh_token: {
            in: ['body'],
            notEmpty: {
                errorMessage: message_1.APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
            },
            trim: true,
            isString: true,
        },
    }));
    static forgotPasswordValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
    }));
    static verifyRecoveryTokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
        code: params_validation_1.ParamsValidation.code,
    }));
}
exports.AuthValidation = AuthValidation;
exports.tokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    Authorization: {
        in: ['headers'],
        notEmpty: {
            errorMessage: message_1.APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const accessToken = value.split(' ')[1];
                if (!accessToken) {
                    return false;
                }
                const result = await (0, jwt_1.verifyToken)(accessToken, process.env.JWT_SECRET_KEY);
                if (!result) {
                    throw new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, httpStatus_1.default.UNAUTHORIZED);
                }
                if (result.expired || !result.payload) {
                    throw new Error_1.AppError(message_1.APP_MESSAGES.TOKEN_IS_EXPIRED, 401);
                }
                req.verifyResult = result;
                return true;
            },
        },
    },
}));
exports.protect = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
    const { payload, expired } = req.verifyResult;
    if (payload !== null && !expired) {
        // req.user = await UserModel.findById((payload as UserPayload).id);
        // if (req.user === null || req.user === undefined) {
        //   return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
        // }
        // if (req.user.status === UserStatus.unverified) {
        //   return next(new AppError(APP_MESSAGES.USER_NOT_VERIFIED, 401));
        // }
        // return next();
        const userRepo = User_1.User.getRepository();
        const user = await userRepo.findOne({ where: { id: payload.id } });
        if (user !== null) {
            if (user.status === enum_1.UserStatus.unverified) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_VERIFIED, 401));
            }
            else {
                return next();
            }
        }
        else {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
    }
    if (expired) {
        return next(new Error_1.AppError(message_1.APP_MESSAGES.TOKEN_IS_EXPIRED, 401));
    }
    return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
});
exports.changePasswordValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
    newPassword: {
        in: ['body'],
        isLength: {
            errorMessage: message_1.APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
            options: { min: 8, max: 32 },
        },
        trim: true,
        notEmpty: {
            errorMessage: message_1.APP_MESSAGES.PASSWORD_IS_REQUIRED,
        },
    },
}));
