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
exports.Developer = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
let Developer = class Developer extends typeorm_1.BaseEntity {
    id;
    name;
    description;
    images;
    created_at;
    is_active;
};
exports.Developer = Developer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Developer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], Developer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], Developer.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.varchar, { array: true }),
    __metadata("design:type", Array)
], Developer.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: () => database_constants_1.DatabaseDefaultValues.now }),
    __metadata("design:type", Date)
], Developer.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], Developer.prototype, "is_active", void 0);
exports.Developer = Developer = __decorate([
    (0, typeorm_1.Entity)('developers')
], Developer);
