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
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const message_1 = require("../constants/message");
const Error_1 = require("../models/Error");
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const enum_1 = require("../constants/enum");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const typedi_1 = require("typedi");
const User_1 = require("../domain/databases/entity/User");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const params_validation_1 = require("../validations/params_validation");
let AuthValidation = class AuthValidation {
    authServices;
    constructor(auth) {
        this.authServices = auth;
    }
    getUserByTokenIfExist = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return next();
        }
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
        const session = await this.authServices.checkSessionExist(result.payload.session_id);
        if (session === null || session === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
        }
        const user = await this.authServices.checkUserExistByID(session.user_id);
        if (user === null || user === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
        }
        req.user = user;
        req.session = session;
        next();
    });
    signUpValidation = [
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
            const user = await this.authServices.checkUserExistByEmail(email);
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
    signInValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
            email: params_validation_1.ParamsValidation.email,
            password: params_validation_1.ParamsValidation.password,
        })),
        async (req, res, next) => {
            const { email, password } = req.body;
            const { user, password_is_correct } = await this.authServices.getUserByEmailAndPassword(email, password);
            if (user === null || user === undefined) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
            }
            if (user.status === enum_1.UserStatus.unverified) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_VERIFIED, 401));
            }
            if (password_is_correct === false) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, 400));
            }
            req.user = user;
            next();
        },
    ];
    acctiveAccountValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
        password: params_validation_1.ParamsValidation.password,
        code: params_validation_1.ParamsValidation.code,
    }));
    resendActivationCodeValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
    }));
    accessTokenValidation = [
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
            const session = await this.authServices.checkSessionExist(result.payload.session_id);
            if (session === null || session === undefined) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
            }
            const user = await this.authServices.checkUserExistByID(session.user_id);
            if (user === null || user === undefined) {
                return next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401));
            }
            req.user = user;
            req.session = session;
            next();
        },
    ];
    refreshTokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        refresh_token: {
            in: ['body'],
            notEmpty: {
                errorMessage: message_1.APP_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
            },
            trim: true,
            isString: true,
        },
    }));
    forgotPasswordValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
    }));
    verifyRecoveryTokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        email: params_validation_1.ParamsValidation.email,
        code: params_validation_1.ParamsValidation.code,
    }));
    resetPasswordValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
            email: params_validation_1.ParamsValidation.email,
            code: params_validation_1.ParamsValidation.code,
            new_password: {
                ...params_validation_1.ParamsValidation.password,
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.confirm_password) {
                            throw new Error_1.AppError(message_1.APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
                        }
                        return true;
                    },
                },
            },
        })),
        // async (req: Request, res: Response, next: NextFunction) => {
        //   const { email, code } = req.body;
        //   const userService = new AuthServices();
        //   const user = await userService.checkUserExistByEmail(email);
        //   if (user === undefined || user === null) {
        //     return next(new AppError(APP_MESSAGES.USER_NOT_FOUND, 404));
        //   }
        //   const otp = await userService.getOTP(user.id, code, 'reset-password');
        //   if (otp === null) {
        //     return next(new AppError(APP_MESSAGES.INVALID_TOKEN, 401));
        //   }
        //   next();
        // },
    ];
    tokenValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
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
    protect = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
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
    changePasswordValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
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
};
AuthValidation = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [auth_service_1.default])
], AuthValidation);
exports.default = AuthValidation;
