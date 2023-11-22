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
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const typeorm_2 = require("typeorm");
let DiscountCode = class DiscountCode extends typeorm_1.BaseEntity {
    id;
    package_id;
    code;
    discount_percent;
    starting_date;
    expiration_date;
    description;
    created_at;
    limited_quantity;
    is_active;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], DiscountCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid }),
    __metadata("design:type", String)
], DiscountCode.prototype, "package_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, unique: true }),
    __metadata("design:type", String)
], DiscountCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.double_precision, default: 0 }),
    __metadata("design:type", Number)
], DiscountCode.prototype, "discount_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date }),
    __metadata("design:type", Date)
], DiscountCode.prototype, "starting_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date }),
    __metadata("design:type", Date)
], DiscountCode.prototype, "expiration_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], DiscountCode.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], DiscountCode.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.integer, nullable: true }),
    __metadata("design:type", Object)
], DiscountCode.prototype, "limited_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], DiscountCode.prototype, "is_active", void 0);
DiscountCode = __decorate([
    (0, typeorm_2.Entity)('discount_codes')
], DiscountCode);
exports.default = DiscountCode;
