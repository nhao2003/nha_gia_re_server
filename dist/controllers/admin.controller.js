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
const admin_service_1 = __importDefault(require("../services/admin.service"));
const post_service_1 = __importDefault(require("../services/post.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const message_1 = require("../constants/message");
const build_query_1 = require("../utils/build_query");
const common_service_1 = __importDefault(require("../services/common.service"));
const Unit_1 = require("../domain/databases/entity/Unit");
const Developer_1 = require("../domain/databases/entity/Developer");
const PropertyType_1 = require("../domain/databases/entity/PropertyType");
const MembershipPackage_1 = __importDefault(require("../domain/databases/entity/MembershipPackage"));
const DiscountCode_1 = __importDefault(require("../domain/databases/entity/DiscountCode"));
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
let AdminController = class AdminController {
    UnitsService;
    DeveloperService;
    PropertyTypeService;
    MembershipPackageService;
    DiscountCodeService;
    adminService;
    userServices;
    postServices;
    constructor(dataSource, adminService, userServices, postServices) {
        this.UnitsService = new common_service_1.default(Unit_1.Unit, dataSource);
        this.DeveloperService = new common_service_1.default(Developer_1.Developer, dataSource);
        this.PropertyTypeService = new common_service_1.default(PropertyType_1.PropertyType, dataSource);
        this.MembershipPackageService = new common_service_1.default(MembershipPackage_1.default, dataSource);
        this.DiscountCodeService = new common_service_1.default(DiscountCode_1.default, dataSource);
        this.adminService = adminService;
        this.userServices = userServices;
        this.postServices = postServices;
    }
    getUnits = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const baseQuery = (0, build_query_1.buildBaseQuery)(req.query);
        const data = await this.UnitsService.getAllByQuery(baseQuery);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_UNIT_INFO_SUCCESSFULLY,
            result: data,
        };
        res.status(200).json(appRes);
    });
    createUnit = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = {
            id: req.body.id,
            unit_name: req.body.unit_name,
        };
        const unit = await this.UnitsService.create(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'APP_MESSAGES.SUCCESS_MESSAGE.CREATE_UNIT_SUCCESSFULLY',
            result: unit,
        };
        res.status(200).json(appRes);
    });
    updateUnit = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        let data = {};
        if (req.body.unit_name) {
            data.unit_name = req.body.unit_name;
        }
        const result = await this.UnitsService.update(id, data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_UNIT_SUCCESSFULLY',
            result: result,
        };
        res.status(200).json(appRes);
    });
    deleteUnit = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.UnitsService.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'APP_MESSAGES.SUCCESS_MESSAGE.DELETE_UNIT_SUCCESSFULLY',
            result: result,
        };
        res.status(200).json(appRes);
    });
    getPosts = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = this.postServices.buildPostQuery(req.query);
        const posts = await this.postServices.getPostsByQuery(query, req.user?.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
            num_of_pages: posts.numberOfPages,
            result: posts.data,
        };
        res.status(200).json(appRes);
    });
    approvePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.post.id;
        if (req.post.status === 'approved') {
            const appRes = {
                status: 'error',
                code: server_codes_1.default.AdminCode.PostAlreadyApproved,
                message: 'Post is already approved',
                result: null,
            };
            return res.status(400).json(appRes);
        }
        const result = await this.adminService.approvePost(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.APPROVE_POST_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    rejectPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.query;
        const { reason } = req.body || 'Not provided';
        const result = await this.adminService.rejectPost(id, reason);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.REJECT_POST_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    deletePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.query;
        const result = await this.adminService.deletePost(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    getUsers = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = this.userServices.buildUserQuery(req.query);
        const users = await this.userServices.getUserByQuery(query);
        // return res.json(users);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.UserCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_USER_INFO_SUCCESSFULLY,
            num_of_pages: users.num_of_pages,
            result: users.users,
        };
        console.log(appRes);
        res.status(200).json(appRes);
    });
    banUser = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const { ban_reason, banned_util } = req.body;
        const result = await this.userServices.banUser(id, ban_reason, banned_util);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'Ban user successfully',
            result: result,
        };
        res.status(200).json(appRes);
    });
    unbanUser = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.userServices.unbanUser(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'Unban user successfully',
            result: result,
        };
        res.status(200).json(appRes);
    });
    getDevelopers = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const developers = await this.DeveloperService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_DEVELOPER_INFO_SUCCESSFULLY,
            num_of_pages: developers.num_of_pages,
            result: developers.data,
        };
        res.status(200).json(appRes);
    });
    createDeveloper = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = req.body;
        const developer = await this.DeveloperService.create(data);
        // return res.json(developer);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
            result: developer,
        };
        res.status(200).json(appRes);
    });
    updateDeveloper = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        let data = {};
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        if (req.body.images) {
            data.images = req.body.images;
        }
        const result = await this.DeveloperService.update(id, data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_POST_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    deleteDeveloper = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.DeveloperService.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'Delete developer successfully',
            result: result,
        };
        res.status(200).json(appRes);
    });
    getPropertyTypes = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const propertyTypes = await this.PropertyTypeService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_PROPERTY_TYPE_INFO_SUCCESSFULLY,
            result: propertyTypes,
        };
        res.status(200).json(appRes);
    });
    createPropertyType = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = {
            id: req.body.id,
            name: req.body.name,
        };
        const propertyType = await this.PropertyTypeService.create(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_PROPERTY_TYPE_SUCCESSFULLY,
            result: propertyType,
        };
        res.status(200).json(appRes);
    });
    updatePropertyType = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        let data = {};
        if (req.body.name) {
            data.name = req.body.name;
        }
        const result = await this.PropertyTypeService.update(id, data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_PROPERTY_TYPE_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    deletePropertyType = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.PropertyTypeService.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    getMembershipPackages = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const membershipPackages = await this.MembershipPackageService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_MEMBERSHIP_PACKAGE_INFO_SUCCESSFULLY,
            result: membershipPackages,
        };
        res.status(200).json(appRes);
    });
    createMembershipPackage = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = req.body;
        const membershipPackage = await this.MembershipPackageService.create(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
            result: membershipPackage,
        };
        res.status(200).json(appRes);
    });
    // Delete membership package
    deleteMembershipPackage = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.MembershipPackageService.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.DELETE_MEMBERSHIP_PACKAGE_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
    getDiscountCodes = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const discountCodes = await this.DiscountCodeService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_MEMBERSHIP_PACKAGE_INFO_SUCCESSFULLY,
            result: discountCodes,
        };
        res.status(200).json(appRes);
    });
    createDiscountCode = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = req.body;
        const discountCode = await this.DiscountCodeService.create(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_DISCOUNT_CODE_SUCCESSFULLY,
            result: discountCode,
        };
        res.status(200).json(appRes);
    });
    // Delete discount code
    deleteDiscountCode = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await this.DiscountCodeService.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.DELETE_DISCOUNT_CODE_SUCCESSFULLY,
            result: result,
        };
        res.status(200).json(appRes);
    });
};
AdminController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource, admin_service_1.default, user_service_1.default, post_service_1.default])
], AdminController);
exports.default = AdminController;
