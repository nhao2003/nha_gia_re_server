"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_query_1 = require("../utils/build_query");
const Error_1 = require("../models/Error");
class CommonServices {
    repository;
    constructor(entity, dataSource) {
        this.repository = dataSource.getRepository(entity);
    }
    buildBaseQuery(query) {
        const { page, sort_fields, sort_orders } = query;
        const handleQuery = {
            ...query,
        };
        delete handleQuery.page;
        delete handleQuery.sort_fields;
        delete handleQuery.sort_orders;
        const wheres = (0, build_query_1.buildQuery)(handleQuery);
        const orders = (0, build_query_1.buildOrder)(sort_fields, sort_orders);
        return { page, wheres, orders };
    }
    async markDeleted(id) {
        const value = await this.repository.findOne({ where: { id: id, is_active: true } });
        if (value === undefined || value === null) {
            throw new Error_1.AppError('Not found', 404);
        }
        await this.repository.update(id, { is_active: false });
    }
    async delete(id) {
        await this.repository.delete(id);
    }
    async getAll() {
        return await this.repository.find();
    }
    async getById(id) {
        return await this.repository.findOne({
            where: {
                id: id,
                is_active: true,
            },
        });
    }
    async getAllByQuery(query) {
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
        const getCount = devQuery.getCount();
        const getMany = devQuery.skip(skip).take(take).getMany();
        const res = await Promise.all([getMany, getCount]);
        return {
            num_of_pages: Math.ceil(res[1] / 10),
            data: res[0],
        };
    }
    async create(data) {
        return await this.repository.save(data);
    }
    async update(id, data) {
        delete data.is_active;
        await this.repository.update(id, data);
        return id;
    }
}
exports.default = CommonServices;
