"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const message_1 = require("../constants/message");
const Error_1 = require("../models/Error");
const handleValidationErrorDB = (err) => {
    const details = Object.values(err.errors).map((el) => {
        return {
            path: el.path,
            message: el.message
        };
    });
    return new Error_1.AppError(message_1.APP_MESSAGES.INVALID_INPUT_DATA, 400, details);
};
const handleUserInputError = (error) => {
    const keyValue = error.keyValue;
    return new Error_1.AppError(message_1.APP_MESSAGES.EMAIL_ALREADY_EXISTS, 400, keyValue);
};
const handleDevelopmentError = (err, res) => {
    console.log(err);
    res.status(err.statusCode || httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const handleProductionError = (err, res) => {
    console.log(err);
    if (err.isOperational !== undefined && err.isOperational) {
        console.log("OPERATIONAL ERROR");
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            details: err.details
        });
    }
    else {
        console.log("PROGRAMMING ERROR");
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: message_1.APP_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};
const errorHandler = (err, req, res, next) => {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
        handleDevelopmentError(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        console.log("PRODUCTION ERROR");
        let error = { ...err };
        error.message = err.message;
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.code === 11000)
            error = handleUserInputError(error);
        if (error.name === "JsonWebTokenError")
            error = new Error_1.AppError(message_1.APP_MESSAGES.INVALID_TOKEN, 401);
        if (error.name === "TokenExpiredError")
            error = new Error_1.AppError(message_1.APP_MESSAGES.TOKEN_IS_EXPIRED, 401);
        handleProductionError(error, res);
    }
    else {
        throw new Error("NODE_ENV is not set");
    }
};
exports.errorHandler = errorHandler;
