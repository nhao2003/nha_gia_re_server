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
const MembershipPackage_1 = __importDefault(require("../domain/databases/entity/MembershipPackage"));
const common_service_1 = __importDefault(require("./common.service"));
const typeorm_1 = require("typeorm");
const Subscription_1 = __importDefault(require("../domain/databases/entity/Subscription "));
const User_1 = require("../domain/databases/entity/User");
const typedi_1 = require("typedi");
let MembershipPackageServices = class MembershipPackageServices extends common_service_1.default {
    subscriptionPackageRepository;
    userRepository;
    constructor(dataSource) {
        super(MembershipPackage_1.default, dataSource);
        this.subscriptionPackageRepository = dataSource.getRepository(Subscription_1.default);
        this.userRepository = dataSource.getRepository(User_1.User);
    }
    async getCurrentUserSubscriptionPackage(user_id, email, phone) {
        if (!user_id && !email && !phone)
            return null;
        let query = this.subscriptionPackageRepository
            .createQueryBuilder()
            .andWhere({
            is_active: true,
        })
            .leftJoinAndSelect('Subscription.membership_package', 'membership_package')
            .leftJoinAndSelect('Subscription.user', 'user')
            .leftJoinAndSelect('Subscription.transaction', 'transaction');
        if (user_id) {
            query = query.andWhere('Subscription.user_id = :user_id', { user_id });
        }
        if (email) {
            query = query.andWhere('user.email = :email', { email });
        }
        if (phone) {
            query = query.andWhere('user.phone = :phone', { phone });
        }
        const subscriptionPackage = await query.getOne();
        return subscriptionPackage;
    }
    getUserWithSubscriptionPackage = async (email, phone, user_id) => {
        const query = this.userRepository.createQueryBuilder().where('status = :status', { status: 'verified' });
        if (email && email !== "") {
            query.andWhere('email = :email', { email });
        }
        if (phone && phone !== "") {
            query.andWhere('phone = :phone', { phone });
        }
        if (user_id && user_id !== "") {
            query.andWhere('id = :user_id', { user_id });
        }
        const result = await Promise.all([query.getOne(), this.getCurrentUserSubscriptionPackage(user_id, email, phone)]);
        return {
            user: result[0],
            subscription: result[1],
        };
    };
};
MembershipPackageServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MembershipPackageServices);
exports.default = MembershipPackageServices;
