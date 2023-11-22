"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const message_1 = require("../constants/message");
const Error_1 = require("../models/Error");
const validate = (validation) => {
    return async (req, res, next) => {
        const body = req.body;
        await validation.run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const details = errors.array().map((error) => {
            return {
                message: error.msg,
                path: error.path,
                value: error.value
            };
        });
        next(new Error_1.AppError(message_1.APP_MESSAGES.INVALID_REQUEST_PARAMS, httpStatus_1.default.BAD_REQUEST, details));
    };
};
exports.validate = validate;
