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
const build_query_1 = require("../utils/build_query");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const membership_package_service_1 = __importDefault(require("../services/membership_package.service"));
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const typedi_1 = require("typedi");
let MembershipPackageController = class MembershipPackageController {
    membershipPackageService;
    constructor(membershipPackageService) {
        this.membershipPackageService = membershipPackageService;
    }
    getMembershipPackages = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const membershipPackages = await this.membershipPackageService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Get membership packages successfully',
            num_of_pages: membershipPackages.num_of_pages,
            result: membershipPackages.data,
        };
        res.status(200).json(appRes);
    });
    getMembershipPackageById = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const membershipPackage = await this.membershipPackageService.getById(req.params.id);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Get membership package successfully',
            result: membershipPackage,
        };
        res.status(200).json(appRes);
    });
    getCurrentUserMembershipPackage = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const user_id = req.user ? req.user.id : req.body.user_id;
        const email = req.user ? req.user.email : req.body.email;
        const phone = req.user ? req.user.phone : req.body.phone;
        if (!user_id && !email && !phone) {
            const appRes = {
                status: 'error',
                code: httpStatus_1.default.BAD_REQUEST,
                message: "Missing 'user_id' or 'email' or 'phone' in request body",
                result: null,
            };
            return res.status(httpStatus_1.default.BAD_REQUEST).json(appRes);
        }
        const membershipPackage = await this.membershipPackageService.getCurrentUserSubscriptionPackage(user_id, email, phone);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Get current user membership package successfully',
            result: membershipPackage,
        };
        res.status(200).json(appRes);
    });
    getUserWithSubscriptionPackage = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        let { user_id, email, phone } = req.query;
        user_id = user_id ? decodeURIComponent(user_id) : user_id;
        email = email ? decodeURIComponent(email) : email;
        phone = phone ? decodeURIComponent(phone) : phone;
        if (!user_id && !email && !phone) {
            const appRes = {
                status: 'error',
                code: httpStatus_1.default.BAD_REQUEST,
                message: "Missing 'user_id' or 'email' or 'phone' in request body",
                result: null,
            };
            return res.status(httpStatus_1.default.BAD_REQUEST).json(appRes);
        }
        const result = await this.membershipPackageService.getUserWithSubscriptionPackage(email, phone, user_id);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Get user with subscription package successfully',
            result,
        };
        res.status(200).json(appRes);
    });
};
MembershipPackageController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [membership_package_service_1.default])
], MembershipPackageController);
exports.default = MembershipPackageController;
