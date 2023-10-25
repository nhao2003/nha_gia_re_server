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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const defaultValue_1 = require("../../../constants/defaultValue");
const enum_1 = require("../../../constants/enum");
const database_constants_1 = require("../constants/database_constants");
const address_1 = __importDefault(require("../../../domain/typing/address"));
const RealEstatePost_1 = require("./RealEstatePost");
let User = class User extends typeorm_1.BaseEntity {
    id;
    status;
    is_identity_verified;
    role;
    email;
    password;
    address;
    first_name;
    last_name;
    gender;
    avatar;
    dob;
    phone;
    last_active_at;
    created_at;
    updated_at;
    banned_util;
    ban_reason;
    posts;
    // Method
    toJSON() {
        const user = { ...this };
        delete user.password;
        delete user.is_active;
        delete user.banned_util;
        delete user.ban_reason;
        delete user.sessions;
        delete user.otps;
        return user;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, default: enum_1.UserStatus.unverified, enum: enum_1.UserStatus }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_identity_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, default: enum_1.Role.user }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.jsonb, { nullable: true }),
    __metadata("design:type", address_1.default)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, default: defaultValue_1.DefaultValue.UNKNOW }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, default: defaultValue_1.DefaultValue.UNKNOW }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'false' }),
    __metadata("design:type", Boolean)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date, nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, default: defaultValue_1.DefaultValue.UNKNOW }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: () => database_constants_1.DatabaseDefaultValues.now }),
    __metadata("design:type", Date)
], User.prototype, "last_active_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: () => database_constants_1.DatabaseDefaultValues.now }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.timestamp_without_timezone, { nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.timestamp_without_timezone, { nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "banned_util", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text, { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "ban_reason", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RealEstatePost_1.RealEstatePost, (real_estate_posts) => real_estate_posts.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
