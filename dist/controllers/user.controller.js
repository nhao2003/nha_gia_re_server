"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filterBody_1 = __importDefault(require("../utils/filterBody"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const enum_1 = require("../constants/enum");
const user_services_1 = __importDefault(require("../services/user.services"));
const Error_1 = require("../models/Error");
class UserController {
    updateProfile = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        let filteredBody = (0, filterBody_1.default)(req.body, ['first_name', 'last_name', 'gender', 'address', 'phone', 'dob']);
        const user = req.user;
        if (user.status === enum_1.UserStatus.not_update) {
            filteredBody = {
                ...filteredBody,
                status: enum_1.UserStatus.verified,
            };
        }
        await user_services_1.default.updateUserInfo(user.id, filteredBody);
        res.status(200).json({
            message: 'Profile updated successfully.',
            data: filteredBody,
        });
    });
    getUserProfile = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        let id = req.params.id === null || req.params.id === undefined ? req.user.id : req.params.id;
        const data = await user_services_1.default.getUserInfo(id);
        if (data === null || data === undefined) {
            return next(new Error_1.AppError('User not found.', 404));
        }
        const filter = data.toJSON();
        res.status(200).json({
            message: 'Get user profile successfully.',
            result: filter,
        });
    });
}
exports.default = new UserController();
