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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
let OTP = class OTP extends typeorm_1.BaseEntity {
    id;
    type;
    issued_at;
    // Default expiration time is 10 minutes
    expiration_time;
    token;
    user_id;
    is_used;
};
exports.OTP = OTP;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], OTP.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], OTP.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], OTP.prototype, "issued_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], OTP.prototype, "expiration_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255 }),
    __metadata("design:type", String)
], OTP.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], OTP.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'false' }),
    __metadata("design:type", Boolean)
], OTP.prototype, "is_used", void 0);
exports.OTP = OTP = __decorate([
    (0, typeorm_1.Entity)('otps')
], OTP);
