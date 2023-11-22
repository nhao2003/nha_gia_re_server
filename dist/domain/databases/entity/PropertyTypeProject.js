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
const Project_1 = require("./Project");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
let PropertyTypeProject = class PropertyTypeProject extends typeorm_1.BaseEntity {
    project_id;
    property_types_id;
    project;
};
__decorate([
    (0, typeorm_2.PrimaryColumn)({ type: database_constants_1.PostgresDataType.uuid }),
    __metadata("design:type", String)
], PropertyTypeProject.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_2.PrimaryColumn)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], PropertyTypeProject.prototype, "property_types_id", void 0);
__decorate([
    (0, typeorm_3.ManyToOne)(() => Project_1.Project, (project) => project.property_types),
    (0, typeorm_4.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", Project_1.Project)
], PropertyTypeProject.prototype, "project", void 0);
PropertyTypeProject = __decorate([
    (0, typeorm_1.Entity)('property_types_projects')
], PropertyTypeProject);
exports.default = PropertyTypeProject;
