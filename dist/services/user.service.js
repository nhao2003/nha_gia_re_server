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
const typeorm_1 = require("typeorm");
const User_1 = require("../domain/databases/entity/User");
const build_query_1 = require("../utils/build_query");
const auth_service_1 = __importDefault(require("./auth.service"));
const Error_1 = require("../models/Error");
const enum_1 = require("../constants/enum");
const typedi_1 = require("typedi");
let UserServices = class UserServices {
    userRepository;
    authServices;
    constructor(dataSource, authServices) {
        this.userRepository = dataSource.getRepository(User_1.User);
        this.authServices = authServices;
    }
    async updateUserInfo(user_id, data) {
        await this.userRepository.update({ id: user_id }, {
            ...data,
            updated_at: new Date(),
        });
        return true;
    }
    async getUserInfo(id, is_active = true) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }
    buildUserQuery(userQuery) {
        const { page, orders } = userQuery;
        const handleQuery = {
            ...userQuery,
        };
        delete handleQuery.page;
        delete handleQuery.orders;
        const wheres = (0, build_query_1.buildQuery)(handleQuery);
        const buildOrders = (0, build_query_1.buildOrder)(orders);
        return { page, wheres, orders: buildOrders };
    }
    async getUserByQuery(userQuery) {
        const page = userQuery.page || 1;
        let query = this.userRepository.createQueryBuilder();
        const wheres = userQuery.wheres;
        if (wheres) {
            wheres.forEach((where) => {
                query = query.andWhere(where);
            });
        }
        const orders = userQuery.orders;
        if (orders) {
            query = query.orderBy(orders);
        }
        const total = query.getCount();
        query = query.skip((page - 1) * 10).take(10);
        const users = query.getMany();
        const result = await Promise.all([total, users]);
        return {
            num_of_pages: Math.ceil(result[0] / 10),
            users: result[1],
        };
    }
    async banUser(id, ban_reason, banned_util) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error_1.AppError('User not found', 404);
        }
        if (user.status === enum_1.UserStatus.banned) {
            throw new Error_1.AppError('User has been banned', 400);
        }
        if (banned_util < new Date()) {
            throw new Error_1.AppError('Banned util is not valid', 400);
        }
        user.status = enum_1.UserStatus.banned;
        user.ban_reason = ban_reason;
        user.banned_util = banned_util;
        const ban = this.userRepository.save(user);
        const signOutAll = this.authServices.signOutAll(id);
        await Promise.all([ban, signOutAll]);
    }
    async unbanUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error_1.AppError('User not found', 404);
        }
        if (user.status !== enum_1.UserStatus.banned) {
            throw new Error_1.AppError('User has not been banned', 400);
        }
        user.status = enum_1.UserStatus.verified;
        user.ban_reason = null;
        user.banned_util = null;
        await this.userRepository.save(user);
    }
};
UserServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource, auth_service_1.default])
], UserServices);
exports.default = UserServices;
