"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const my_repository_1 = require("../repositories/my_repository");
const build_query_1 = require("../utils/build_query");
class UserServices {
    userRepository;
    constructor() {
        this.userRepository = my_repository_1.MyRepository.userRepository();
    }
    async updateUserInfo(user_id, data) {
        await this.userRepository.update({ id: user_id }, {
            ...data,
            updated_at: new Date(),
        });
        return true;
    }
    async getUserInfo(id, is_active = true) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }
    buildUserQuery(userQuery) {
        const { page, sort_fields, sort_orders } = userQuery;
        const query = {};
        const handleQuery = {
            ...userQuery,
        };
        delete handleQuery.page;
        delete handleQuery.sort_fields;
        delete handleQuery.sort_orders;
        const wheres = (0, build_query_1.buildQuery)(handleQuery);
        const orders = (0, build_query_1.buildOrder)(sort_fields, sort_orders);
        return { page, wheres, orders };
    }
    async getUserByQuery(userQuery) {
        const page = userQuery.page || 1;
        let query = this.userRepository
            .createQueryBuilder()
            .skip((page - 1) * 10)
            .take(10);
        const wheres = userQuery.wheres;
        if (wheres) {
            wheres.forEach((where) => {
                query = query.andWhere(where);
            });
        }
        const orders = userQuery.orders;
        if (orders) {
            query = query.orderBy(orders);
        }
        console.log(query.getSql());
        const users = await query.getMany();
        return users;
    }
}
exports.default = new UserServices();
