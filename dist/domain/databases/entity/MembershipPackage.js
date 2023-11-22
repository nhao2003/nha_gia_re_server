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
const typeorm_2 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const Subscription_1 = __importDefault(require("./Subscription "));
let MembershipPackage = class MembershipPackage extends typeorm_1.BaseEntity {
    id;
    name;
    description;
    price_per_month;
    monthly_post_limit;
    post_approval_priority_point;
    display_priority_point;
    is_active;
    created_at;
    subscriptions;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], MembershipPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], MembershipPackage.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], MembershipPackage.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.bigint }),
    __metadata("design:type", Number)
], MembershipPackage.prototype, "price_per_month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.integer }),
    __metadata("design:type", Number)
], MembershipPackage.prototype, "monthly_post_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.integer }),
    __metadata("design:type", Number)
], MembershipPackage.prototype, "post_approval_priority_point", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.integer }),
    __metadata("design:type", Number)
], MembershipPackage.prototype, "display_priority_point", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], MembershipPackage.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], MembershipPackage.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.default, subscription => subscription.membership_package),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Array)
], MembershipPackage.prototype, "subscriptions", void 0);
MembershipPackage = __decorate([
    (0, typeorm_2.Entity)('membership_packages')
], MembershipPackage);
exports.default = MembershipPackage;
