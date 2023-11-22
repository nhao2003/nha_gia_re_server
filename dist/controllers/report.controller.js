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
const report_service_1 = __importDefault(require("../services/report.service"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const build_query_1 = require("../utils/build_query");
const typedi_1 = require("typedi");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    getAllReport = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const reports = await this.reportService.getAllByQuery(query);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Get all reports successfully',
            num_of_pages: reports.num_of_pages,
            result: reports.data
        };
        res.json(appRes);
    });
    updateReport = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const report = await this.reportService.updateReportStatus(id, req.body.status);
        const appRes = {
            status: 'success',
            code: 200,
            message: 'Update report successfully',
            result: report
        };
        res.json(appRes);
    });
};
ReportController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [report_service_1.default])
], ReportController);
exports.default = ReportController;
