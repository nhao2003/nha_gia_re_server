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
const common_service_1 = __importDefault(require("./common.service"));
const Report_1 = __importDefault(require("../domain/databases/entity/Report"));
const RealEstatePost_1 = require("../domain/databases/entity/RealEstatePost");
const User_1 = require("../domain/databases/entity/User");
const Error_1 = require("../models/Error");
const enum_1 = require("../constants/enum");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
let ReportService = class ReportService extends common_service_1.default {
    constructor(dataSource) {
        super(Report_1.default, dataSource);
    }
    async getAllByQuery(query) {
        let { page, wheres, orders } = query;
        page = Number(page) || 1;
        const skip = (page - 1) * 10;
        const take = 10;
        let devQuery = this.repository.createQueryBuilder();
        devQuery = devQuery.leftJoinAndSelect('Report.reporter', 'user');
        devQuery = devQuery.setParameters({ current_user_id: null });
        if (wheres) {
            wheres.forEach((where) => {
                if (where === "type = 'post'") {
                    devQuery = devQuery.leftJoinAndMapOne('Report.reported', RealEstatePost_1.RealEstatePost, 'RealEstatePost', 'RealEstatePost.id = Report.reported_id');
                }
                else if (where === "type = 'user'") {
                    devQuery = devQuery.leftJoinAndMapOne('Report.reported', User_1.User, 'User', 'User.id = Report.reported_id');
                }
                devQuery = devQuery.andWhere('Report.' + where);
            });
        }
        if (orders) {
            devQuery = devQuery.orderBy(orders);
        }
        const getCount = devQuery.getCount();
        const getMany = devQuery.skip(skip).take(take).getMany();
        const values_2 = await Promise.all([getCount, getMany]);
        const [count, reports] = values_2;
        return {
            num_of_pages: Math.ceil(count / 10),
            data: reports,
        };
    }
    updateReportStatus = async (id, status) => {
        const report = await this.repository.findOne({
            where: {
                id,
            },
        });
        if (!Object.values(enum_1.ReportStatus).includes(status) || status === enum_1.ReportStatus.pending) {
            throw new Error_1.AppError('Status is not valid', 400);
        }
        if (report.status !== enum_1.ReportStatus.pending) {
            throw new Error_1.AppError('Report has been processed', 400);
        }
        if (!report) {
            throw new Error_1.AppError('Report not found', 404);
        }
        report.status = status;
        return await this.repository.save(report);
    };
};
ReportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ReportService);
exports.default = ReportService;
