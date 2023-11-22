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
const enum_1 = require("../../../constants/enum");
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const User_1 = require("./User");
let Report = class Report {
    id;
    reporter_id;
    reported_id;
    status;
    type;
    content_type;
    description;
    images;
    created_date;
    reporter;
    reported;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid }),
    __metadata("design:type", String)
], Report.prototype, "reporter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid }),
    __metadata("design:type", String)
], Report.prototype, "reported_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], Report.prototype, "content_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, array: true, nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], Report.prototype, "created_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.reports),
    (0, typeorm_1.JoinColumn)({ name: 'reporter_id' }),
    __metadata("design:type", User_1.User)
], Report.prototype, "reporter", void 0);
Report = __decorate([
    (0, typeorm_1.Entity)('reports')
], Report);
exports.default = Report;
