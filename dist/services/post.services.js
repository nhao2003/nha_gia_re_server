"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const my_repository_1 = require("../repositories/my_repository");
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
            updated_at: new Date(),
        };
        return data;
    }
    async deletePost(id) {
        return id;
    }
    async getPosts(page) {
        //Using pagination
        const posts = await this.postRepository
            .createQueryBuilder()
            .skip((page - 1) * 10)
            .take(10)
            .addOrderBy('posted_date', 'DESC')
            .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
            .andWhere('is_active = :is_active', { is_active: true })
            .getMany();
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
}
exports.default = new PostServices();
