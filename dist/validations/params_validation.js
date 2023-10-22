"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsValidation = void 0;
const message_1 = require("../constants/message");
const address_1 = __importDefault(require("../domain/typing/address"));
const Error_1 = require("../models/Error");
class ParamsValidation {
    static email = {
        in: ['body'],
        isEmail: {
            errorMessage: 'Email is not valid',
        },
        notEmpty: {
            errorMessage: message_1.APP_MESSAGES.EMAIL_IS_REQUIRED,
        },
        trim: true,
    };
    static password = {
        in: ['body'],
        isLength: {
            errorMessage: message_1.APP_MESSAGES.PASSWORD_LENGTH_MUST_BE_AT_LEAST_8_CHARS_AND_LESS_THAN_32_CHARS,
            options: { min: 8, max: 32 },
        },
        trim: true,
        notEmpty: {
            errorMessage: message_1.APP_MESSAGES.PASSWORD_IS_REQUIRED,
        },
    };
    static confirm_new_password = {
        ...ParamsValidation.password,
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.new_password) {
                    throw new Error_1.AppError(message_1.APP_MESSAGES.VALIDATION_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH, 400);
                }
                return true;
            },
        },
    };
    static code = {
        in: ['body'],
        notEmpty: {
            errorMessage: message_1.APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
        },
        trim: true,
        isString: {
            errorMessage: message_1.APP_MESSAGES.VALIDATION_MESSAGE.OTP_CODE_IS_REQUIRED,
        },
    };
    static phone = {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: message_1.APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_REQUIRED,
        },
        isMobilePhone: {
            errorMessage: message_1.APP_MESSAGES.VALIDATION_MESSAGE.PHONE_IS_INVALID,
        },
    };
    static address = {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Address is required',
        },
        custom: {
            options: (value) => {
                try {
                    address_1.default.fromJSON(value);
                    return true;
                }
                catch (error) {
                    return false;
                }
            },
            errorMessage: 'Address is not valid.',
        },
    };
    static date = {
        in: ['body'],
        isDate: true,
    };
    static name = {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'Name is not valid',
        },
        isLength: {
            errorMessage: 'Name must be at least 1 characters and less than 50 characters',
            options: { min: 1, max: 50 },
        },
    };
    static gender = {
        isBoolean: {
            errorMessage: 'Gender is boolean',
        }
    };
    static uuid = {
        in: ['params'],
        isUUID: {
            errorMessage: message_1.APP_MESSAGES.VALIDATION_MESSAGE.IS_INVALID_ID,
        },
    };
}
exports.ParamsValidation = ParamsValidation;
