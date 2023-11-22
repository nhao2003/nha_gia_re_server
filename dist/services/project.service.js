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
const Project_1 = require("../domain/databases/entity/Project");
const common_service_1 = __importDefault(require("./common.service"));
const PropertyTypeProject_1 = __importDefault(require("../domain/databases/entity/PropertyTypeProject"));
const typeorm_1 = require("typeorm");
const ProjectScale_1 = __importDefault(require("../domain/databases/entity/ProjectScale"));
const database_1 = require("../app/database");
const typedi_1 = require("typedi");
let ProjectServices = class ProjectServices extends common_service_1.default {
    propertyTypeProjectRepo;
    projectScaleRepo;
    constructor(dataSource) {
        super(Project_1.Project, dataSource);
        this.propertyTypeProjectRepo = database_1.AppDataSource.getRepository(PropertyTypeProject_1.default);
        this.projectScaleRepo = database_1.AppDataSource.getRepository(ProjectScale_1.default);
    }
    async create(data) {
        const project_types = data.project_types;
        const scales = data.scales;
        data.verified = true;
        const project = await super.create(data);
        if (project_types) {
            const propertyTypeProjects = project_types.map((property_type_id) => {
                const propertyTypeProject = new PropertyTypeProject_1.default();
                propertyTypeProject.project;
                propertyTypeProject.project_id = project.id;
                propertyTypeProject.property_types_id = property_type_id;
                return propertyTypeProject;
            });
            await this.propertyTypeProjectRepo.save(propertyTypeProjects);
        }
        if (scales) {
            const projectScales = scales.map((scale) => {
                const projectScale = new ProjectScale_1.default();
                projectScale.project_id = project.id;
                projectScale.scale = scale.scale;
                projectScale.unit_id = scale.unit_id;
                return projectScale;
            });
            await this.projectScaleRepo.save(projectScales);
        }
        return project;
    }
    async getAllByQuery(query) {
        let { page, wheres, orders } = query;
        page = Number(page) || 1;
        const skip = (page - 1) * 10;
        const take = 10;
        let baseQuery = this.repository.createQueryBuilder();
        baseQuery = baseQuery.leftJoinAndSelect('Project.developer', 'developer');
        // baseQuery = baseQuery.leftJoinAndSelect('Project.property_types', 'property_types');
        baseQuery = baseQuery.leftJoinAndSelect('Project.scales', 'scales');
        if (wheres) {
            wheres.forEach((where) => {
                baseQuery = baseQuery.andWhere(where);
            });
        }
        if (orders) {
            baseQuery = baseQuery.orderBy(orders);
        }
        const getCount = baseQuery.getCount();
        const getMany = baseQuery.skip(skip).take(take).getMany();
        const res = await Promise.all([getMany, getCount]);
        return {
            num_of_pages: Math.ceil(res[1] / 10),
            data: res[0],
        };
    }
    async update(id, data) {
        const project = (await super.getById(id));
        const project_types = data.project_types;
        const promieses = [];
        const scales = data.scales;
        if (project_types !== null && Array.isArray(project_types)) {
            const propertyTypeProjects = project_types.map((property_type_id) => ({
                projects_id: project.id,
                property_types_id: property_type_id,
            }));
            promieses.push(this.propertyTypeProjectRepo.delete({ project_id: project.id }));
            promieses.push(this.propertyTypeProjectRepo.save(propertyTypeProjects));
        }
        if (scales !== null && Array.isArray(scales)) {
            const projectScales = scales.map((scale) => ({
                project_id: project.id,
                scale: scale.scale,
                unit_id: scale.unit_id,
            }));
            promieses.push(this.projectScaleRepo.delete({ project_id: project.id }));
            promieses.push(this.projectScaleRepo.save(projectScales));
        }
        // Update project
        delete data.project_types;
        delete data.scales;
        promieses.push(this.repository.update(id, data));
        const results = await Promise.all(promieses);
        return results[results.length - 1];
    }
    async deleteUnverifiedProject(id) {
        await this.repository.delete({
            id,
            verified: false,
        });
    }
    async createUnverifiedProject(name) {
        const project = new Project_1.Project();
        project.project_name = name;
        project.verified = false;
        // Return id of project
        const result = await this.repository.save(project);
        return result;
    }
    async getOrCreateUnverifiedProject(id, project_name) {
        if (id) {
            const project = (await this.getById(id));
            if (project) {
                return project.id;
            }
        }
        if (project_name) {
            const project = await this.repository.findOne({
                where: {
                    project_name,
                    verified: false,
                },
            });
            if (project) {
                return project.id;
            }
        }
        if (!project_name) {
            return null;
        }
        const project = await this.createUnverifiedProject(project_name);
        return project.id;
    }
};
ProjectServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProjectServices);
exports.default = ProjectServices;
