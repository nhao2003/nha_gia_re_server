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
const project_service_1 = __importDefault(require("../services/project.service"));
const build_query_1 = require("../utils/build_query");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const message_1 = require("../constants/message");
const typedi_1 = require("typedi");
let ProjectController = class ProjectController {
    projectServices;
    constructor(projectServices) {
        this.projectServices = projectServices;
    }
    getProjects = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const projects = await this.projectServices.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_PROJECT_SUCCESSFULLY,
            num_of_pages: projects.num_of_pages,
            result: projects.data,
        };
        res.status(200).json(appRes);
    });
    createProject = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        //TODO: validate scales and types
        const data = req.body;
        const project = await this.projectServices.create(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_PROJECT_SUCCESSFULLY,
            result: project,
        };
        res.status(200).json(appRes);
    });
    updateProject = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const project = await this.projectServices.update(id, data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_PROJECT_SUCCESSFULLY,
            result: project,
        };
        res.status(200).json(appRes);
    });
    deleteProject = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.params.id;
        const project = await this.projectServices.markDeleted(id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.AdminCode.Success,
            message: 'Delete project successfully',
            result: project,
        };
        res.status(200).json(appRes);
    });
};
ProjectController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [project_service_1.default])
], ProjectController);
exports.default = ProjectController;
