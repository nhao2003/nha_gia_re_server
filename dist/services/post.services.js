"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const my_repository_1 = require("../repositories/my_repository");
const build_query_1 = require("../utils/build_query");
const time_1 = require("../utils/time");
class PostServices {
    postRepository;
    constructor() {
        this.postRepository = my_repository_1.MyRepository.postRepository();
    }
    async createPost(data) {
        data = {
            ...data,
            status: enum_1.PostStatus.pending,
            //expiry_date 14 days from now
            expiry_date: new Date(Date.now() + (0, time_1.parseTimeToMilliseconds)('14d')),
            is_priority: false,
            post_approval_priority: false,
        };
        await this.postRepository.insert(data);
        return data;
    }
    async getPostById(id) {
        const post = await this.postRepository.findOne({
            where: {
                id,
                expiry_date: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                is_active: true,
            },
        });
        return post;
    }
    async updatePost(id, data) {
        data = {
            ...data,
        };
        const result = await this.postRepository.update(id, data);
        return result;
    }
    async deletePost(id) {
        await this.postRepository.update(id, { is_active: false });
        return id;
    }
    async getPosts(page) {
        page = page || 1;
        const query = this.postRepository
            .createQueryBuilder()
            .skip((page - 1) * 10)
            .take(10)
            .addOrderBy('RealEstatePost.posted_date', 'DESC')
            .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
            .andWhere('RealEstatePost.is_active = :is_active', { is_active: true })
            .leftJoinAndSelect('RealEstatePost.user', 'user')
            .andWhere('user.status = :status', { status: enum_1.UserStatus.not_update });
        const getSql = query.getSql();
        console.log(getSql);
        const posts = await query.getMany();
        return posts;
    }
    buildPostQuery(query) {
        const { page, sort_fields, sort_orders } = query;
        const pageParam = Number(page) || 1;
        const postQueries = {};
        const userQueries = {};
        Object.keys(query)
            .filter((key) => key.startsWith('post.'))
            .forEach((key) => {
            postQueries[key.replace('post.', '')] = query[key];
        });
        Object.keys(query)
            .filter((key) => key.startsWith('user.'))
            .forEach((key) => {
            userQueries[key.replace('user.', '')] = query[key];
        });
        const postWhere = (0, build_query_1.buildQuery)(postQueries, ['address', 'features']);
        const userWhere = (0, build_query_1.buildQuery)(userQueries, ['address']);
        const order = (0, build_query_1.buildOrder)(sort_fields, sort_orders, 'RealEstatePost');
        return {
            page: pageParam,
            postWhere,
            userWhere,
            order,
        };
    }
    async getPostsByQuery(postQuery) {
        const page = postQuery.page || 1;
        let query = this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect('RealEstatePost.user', 'user')
            .orderBy(postQuery.order)
            .skip((page - 1) * 10)
            .take(10);
        if (postQuery.postWhere) {
            postQuery.postWhere.forEach((item) => {
                query = query.andWhere(`RealEstatePost.${item}`);
            });
        }
        if (postQuery.userWhere) {
            postQuery.userWhere.forEach((item) => {
                query = query.andWhere(`user.${item}`);
            });
        }
        const getSql = query.getSql();
        console.log(getSql);
        const posts = await query.getMany();
        return posts;
    }
    async getPostsByUser(user_id, page) {
        const posts = await this.postRepository.query(`SELECT * FROM real_estate_posts WHERE user_id = '${user_id}' LIMIT 10 OFFSET ${page * 10}`);
    }
    async getPostsByProject(project_id) {
        return project_id;
    }
    async getPostsByType(type_id) {
        return type_id;
    }
    async checkPostExist(id) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            },
        });
        return post;
    }
}
exports.default = new PostServices();
