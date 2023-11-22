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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const address_1 = __importDefault(require("../../../domain/typing/address"));
const typeorm_2 = require("typeorm");
const Developer_1 = require("./Developer");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const PropertyTypeProject_1 = __importDefault(require("./PropertyTypeProject"));
const ProjectScale_1 = __importDefault(require("./ProjectScale"));
const enum_1 = require("../../../constants/enum");
let Project = class Project extends typeorm_1.BaseEntity {
    id;
    developer_id;
    project_name;
    total_area;
    starting_date;
    completion_date;
    address;
    address_point;
    progression;
    status;
    images;
    verified;
    is_active;
    developer;
    property_types;
    scales;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "developer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255 }),
    __metadata("design:type", String)
], Project.prototype, "project_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.double_precision, nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "total_area", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date, nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "starting_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date, nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "completion_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.date, nullable: true }),
    __metadata("design:type", address_1.default)
], Project.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.point, nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "address_point", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "progression", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, array: true, nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: false, nullable: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_2.ManyToOne)(() => Developer_1.Developer, (developer) => developer.projects),
    (0, typeorm_3.JoinColumn)({ name: 'developer_id' }),
    __metadata("design:type", Developer_1.Developer)
], Project.prototype, "developer", void 0);
__decorate([
    (0, typeorm_4.OneToMany)(() => PropertyTypeProject_1.default, (propertyTypeProject) => propertyTypeProject.project),
    (0, typeorm_3.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Array)
], Project.prototype, "property_types", void 0);
__decorate([
    (0, typeorm_4.OneToMany)(() => ProjectScale_1.default, (projectScale) => projectScale.project),
    (0, typeorm_3.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Array)
], Project.prototype, "scales", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
