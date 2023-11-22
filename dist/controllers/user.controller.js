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
const filterBody_1 = __importDefault(require("../utils/filterBody"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const enum_1 = require("../constants/enum");
const user_service_1 = __importDefault(require("../services/user.service"));
const Error_1 = require("../models/Error");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const message_1 = require("../constants/message");
const typedi_1 = require("typedi");
let UserController = class UserController {
    userServices;
    constructor(userServices) {
        this.userServices = userServices;
    }
    updateProfile = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        let filteredBody = (0, filterBody_1.default)(req.body, ['first_name', 'last_name', 'gender', 'address', 'phone', 'dob']);
        const user = req.user;
        if (user.status === enum_1.UserStatus.not_update) {
            filteredBody = {
                ...filteredBody,
                status: enum_1.UserStatus.verified,
            };
        }
        await this.userServices.updateUserInfo(user.id, filteredBody);
        // res.status(200).json({
        //   message: 'Profile updated successfully.',
        //   data: filteredBody,
        // });
        const appRes = {
            status: 'success',
            code: server_codes_1.default.UserCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_USER_INFO_SUCCESSFULLY,
        };
        res.status(200).json(appRes);
    });
    getUserProfile = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        let id = req.params.id === null || req.params.id === undefined ? req.user.id : req.params.id;
        const data = await this.userServices.getUserInfo(id);
        if (data === null || data === undefined) {
            return next(new Error_1.AppError(message_1.APP_MESSAGES.USER_NOT_FOUND, 404));
        }
        const appRes = {
            status: 'success',
            code: server_codes_1.default.UserCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
            result: data,
        };
        res.status(200).json(appRes);
    });
};
UserController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.default])
], UserController);
exports.default = UserController;
