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
exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const typeorm_3 = require("typeorm");
let PropertyType = class PropertyType extends typeorm_1.BaseEntity {
    id;
    name;
    is_active;
};
exports.PropertyType = PropertyType;
__decorate([
    (0, typeorm_2.PrimaryColumn)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], PropertyType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255 }),
    __metadata("design:type", String)
], PropertyType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.boolean, { default: true }),
    __metadata("design:type", Boolean)
], PropertyType.prototype, "is_active", void 0);
exports.PropertyType = PropertyType = __decorate([
    (0, typeorm_3.Entity)('property_types')
], PropertyType);
