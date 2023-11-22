"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Error_1 = require("../models/Error");
const signToken = ({ payload, expiresIn, secretKey = process.env.JWT_SECRET_KEY, }) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, secretKey, {
            algorithm: 'HS256',
            expiresIn,
        }, (error, token) => {
            if (error) {
                reject(new Error_1.AppError(error.message, 500));
            }
            else if (!token) {
                reject(new Error_1.AppError('TOKEN_SIGNING_ERROR', 500));
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.signToken = signToken;
function verifyToken(token, secretKey = process.env.JWT_SECRET_KEY) {
    return new Promise((resolve) => {
        jsonwebtoken_1.default.verify(token, secretKey, (error, payload) => {
            resolve({ payload: payload, expired: error?.name === 'TokenExpiredError' });
        });
    });
}
exports.verifyToken = verifyToken;
