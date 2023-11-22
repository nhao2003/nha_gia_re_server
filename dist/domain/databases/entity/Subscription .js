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
const database_constants_1 = require("../constants/database_constants");
const MembershipPackage_1 = __importDefault(require("./MembershipPackage"));
const User_1 = require("./User");
const Transaction_1 = __importDefault(require("./Transaction"));
let Subscription = class Subscription extends typeorm_1.BaseEntity {
    id;
    user_id;
    package_id;
    transaction_id;
    starting_date;
    expiration_date;
    is_active;
    membership_package;
    user;
    transaction;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Subscription.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Subscription.prototype, "package_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, nullable: true }),
    __metadata("design:type", Object)
], Subscription.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: () => database_constants_1.DatabaseDefaultValues.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "starting_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], Subscription.prototype, "expiration_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MembershipPackage_1.default, membershipPackage => membershipPackage.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", MembershipPackage_1.default)
], Subscription.prototype, "membership_package", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.subscriptions),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Subscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Transaction_1.default, transaction => transaction.subscription),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", Transaction_1.default)
], Subscription.prototype, "transaction", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)('subscriptions')
], Subscription);
exports.default = Subscription;
