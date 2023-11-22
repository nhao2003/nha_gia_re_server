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
const Subscription_1 = __importDefault(require("../domain/databases/entity/Subscription "));
const User_1 = require("../domain/databases/entity/User");
const common_service_1 = __importDefault(require("./common.service"));
const database_1 = require("../app/database");
const typedi_1 = require("typedi");
let SubscriptionService = class SubscriptionService extends common_service_1.default {
    subcritpionRepository;
    userRepository;
    constructor(dataSource) {
        super(Subscription_1.default, dataSource);
        this.subcritpionRepository = database_1.AppDataSource.getRepository(Subscription_1.default);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async checkUserHasSubscription(user_id) {
        const res = this.subcritpionRepository.findOne({
            where: { user_id, expiration_date: (0, typeorm_1.MoreThanOrEqual)(new Date()), is_active: true },
        });
        return res;
    }
    async createSubscription(create) {
        const res = await this.subcritpionRepository.insert({
            user_id: create.user_id,
            package_id: create.package_id,
            starting_date: create.starting_date.toISOString(),
            expiration_date: create.expiration_date.toISOString(),
            transaction_id: create.transaction_id,
            is_active: true,
        });
        return res.identifiers[0].id;
    }
    async unsubscribe(user_id) {
        const subscription = await this.checkUserHasSubscription(user_id);
        if (!subscription) {
            return false;
        }
        await this.markDeleted(subscription.id);
        return true;
    }
};
SubscriptionService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SubscriptionService);
exports.default = SubscriptionService;
