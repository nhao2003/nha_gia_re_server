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
const Blog_1 = __importDefault(require("../domain/databases/entity/Blog"));
const common_service_1 = __importDefault(require("./common.service"));
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
let BlogService = class BlogService extends common_service_1.default {
    constructor(dataSource) {
        super(Blog_1.default, dataSource);
    }
    async getAllWithFavoriteByQuery(query, current_user_id) {
        let { page, wheres, orders } = query;
        page = Number(page) || 1;
        const skip = (page - 1) * 10;
        const take = 10;
        let devQuery = this.repository.createQueryBuilder();
        if (wheres) {
            wheres.forEach((where) => {
                devQuery = devQuery.andWhere(where);
            });
        }
        if (orders) {
            devQuery = devQuery.orderBy(orders);
        }
        devQuery = devQuery.setParameters({ current_user_id });
        const getCount = devQuery.getCount();
        const getMany = devQuery.skip(skip).take(take).getMany();
        const res = await Promise.all([getMany, getCount]);
        return {
            num_of_pages: Math.ceil(res[1] / 10),
            data: res[0],
        };
    }
};
BlogService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BlogService);
exports.default = BlogService;
