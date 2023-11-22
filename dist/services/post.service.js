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
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const RealEstatePost_1 = require("../domain/databases/entity/RealEstatePost");
const UserPostFavorite_1 = __importDefault(require("../domain/databases/entity/UserPostFavorite"));
const UserPostView_1 = __importDefault(require("../domain/databases/entity/UserPostView"));
const build_query_1 = require("../utils/build_query");
const time_1 = require("../utils/time");
const project_service_1 = __importDefault(require("./project.service"));
const Subscription_1 = __importDefault(require("../domain/databases/entity/Subscription "));
const Error_1 = require("../models/Error");
const membership_package_service_1 = __importDefault(require("./membership_package.service"));
const typedi_1 = require("typedi");
let PostServices = class PostServices {
    postRepository;
    postFavoriteRepository;
    postViewRepository;
    subscriptionRepository;
    membershipPackageServices;
    projectServices;
    constructor(dataSource) {
        this.postRepository = dataSource.getRepository(RealEstatePost_1.RealEstatePost);
        this.postFavoriteRepository = dataSource.getRepository(UserPostFavorite_1.default);
        this.postViewRepository = dataSource.getRepository(UserPostView_1.default);
        this.subscriptionRepository = dataSource.getRepository(Subscription_1.default);
        this.membershipPackageServices = new membership_package_service_1.default(dataSource);
        this.projectServices = new project_service_1.default(dataSource);
    }
    async createPost(data) {
        const subscriptionPackage = await this.membershipPackageServices.getCurrentUserSubscriptionPackage(data.user_id);
        const countPostInMonth = await this.countPostInMonth(data.user_id);
        const limitPostInMonth = subscriptionPackage ? subscriptionPackage.membership_package.monthly_post_limit : 3;
        if (countPostInMonth >= limitPostInMonth) {
            throw new Error_1.AppError(`You have exceeded the number of posts in the month (${limitPostInMonth} posts).`, 400);
        }
        var display_priority_point = 0;
        var post_approval_priority_point = 0;
        if (subscriptionPackage) {
            display_priority_point += subscriptionPackage.membership_package.display_priority_point;
            post_approval_priority_point += subscriptionPackage.membership_package.post_approval_priority_point;
            display_priority_point += subscriptionPackage.user.is_identity_verified ? 1 : 0;
        }
        data = {
            ...data,
            status: enum_1.PostStatus.pending,
            //expiry_date 14 days from now
            expiry_date: new Date(Date.now() + (0, time_1.parseTimeToMilliseconds)('14d')),
            is_priority: false,
            display_priority_point,
            post_approval_priority_point,
        };
        const project = data.project;
        if (project) {
            data.project_id = await this.projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
        }
        delete data.project;
        await this.postRepository.insert(data);
        return data;
    }
    async getPostById(id) {
        const post = await this.postRepository
            .createQueryBuilder()
            .where('id = :id', { id })
            .andWhere('is_active = :is_active', { is_active: true })
            .setParameters({ current_user_id: null })
            .getOne();
        return post;
    }
    async updatePost(id, data) {
        data = {
            ...data,
        };
        const project = data.project;
        if (project) {
            data.project_id = await this.projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
            await this.projectServices.deleteUnverifiedProject(project.id);
        }
        const result = await this.postRepository.update(id, data);
        return result;
    }
    async deletePost(id) {
        await this.postRepository.update(id, { is_active: false });
        return id;
    }
    buildPostQuery(query) {
        const { page, orders, search } = query;
        const pageParam = Number(page) || 1;
        const postQueries = {};
        const userQueries = {};
        Object.keys(query)
            .filter((key) => key.startsWith('post_'))
            .forEach((key) => {
            postQueries[key.replace('post_', '')] = query[key];
        });
        Object.keys(query)
            .filter((key) => key.startsWith('user_'))
            .forEach((key) => {
            userQueries[key.replace('user_', '')] = query[key];
        });
        const postWhere = (0, build_query_1.buildQuery)(postQueries);
        const userWhere = (0, build_query_1.buildQuery)(userQueries);
        const order = (0, build_query_1.buildOrder)(orders, 'RealEstatePost');
        return {
            page: pageParam,
            postWhere,
            userWhere,
            order,
            search,
        };
    }
    async getPostsByQuery(postQuery, user_id = null) {
        const page = postQuery.page || 1;
        let query = this.postRepository.createQueryBuilder().leftJoinAndSelect('RealEstatePost.user', 'user');
        if (postQuery.postWhere) {
            postQuery.postWhere.forEach((item) => {
                query = query.andWhere(`RealEstatePost.${item}`);
            });
        }
        if (postQuery.userWhere) {
            postQuery.userWhere.forEach((item) => {
                const userWhere = `"user".${item}`;
                query = query.andWhere(userWhere);
            });
        }
        query = query.setParameters({ current_user_id: user_id });
        var { search } = postQuery;
        if (search) {
            search = search.replace(/ /g, ' | ');
            query = query.andWhere(`"RealEstatePost".document @@ to_tsquery('simple', unaccent('${search}'))`);
            query = query.orderBy(`ts_rank(document, to_tsquery('simple', unaccent('${search}')))`, 'DESC');
        }
        query = query.orderBy(postQuery.order);
        const total = query.getCount();
        const data = query
            .skip((page - 1) * 10)
            .take(10)
            .getMany();
        const result = await Promise.all([total, data]);
        return {
            numberOfPages: Math.ceil(result[0] / 10),
            data: result[1],
        };
    }
    async getPostsByProject(project_id) {
        return project_id;
    }
    async getPostsByType(type_id) {
        return type_id;
    }
    async checkPostExist(id) {
        const post = await this.postRepository
            .createQueryBuilder()
            .where('id = :id', { id })
            .setParameters({
            current_user_id: null,
        })
            .getOne();
        // .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
        // .andWhere('is_active = :is_active', { is_active: true })
        return post;
    }
    /**
     * Toggles the favorite status of a post for a given user.
     * @param user_id - The ID of the user.
     * @param post_id - The ID of the post.
     * @returns A boolean indicating whether the post is now favorited or not.
     */
    async toggleFavorite(user_id, post_id) {
        const favoritePost = await this.postFavoriteRepository.findOne({
            where: {
                user_id,
                real_estate_posts_id: post_id,
            },
        });
        if (favoritePost) {
            await this.postFavoriteRepository.delete({
                user_id,
                real_estate_posts_id: post_id,
            });
            return false;
        }
        else {
            await this.postFavoriteRepository.insert({
                user_id,
                real_estate_posts_id: post_id,
            });
            return true;
        }
    }
    // Mark read post
    async markReadPost(user_id, post_id) {
        await this.postViewRepository
            .insert({
            user_id,
            real_estate_posts_id: post_id,
            view_date: new Date(),
        })
            .catch((err) => {
            // If the post is already marked as read, do nothing
            if (err.code === '23505') {
                return;
            }
            throw err;
        });
    }
    // Đếm tổng số bài đăng của user trong 1 tháng
    async countPostInMonth(user_id) {
        const count = await this.postRepository
            .createQueryBuilder()
            .where('user_id = :user_id', { user_id })
            .andWhere({
            is_active: true,
        })
            .andWhere('EXTRACT(MONTH FROM posted_date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)')
            .andWhere('EXTRACT(YEAR FROM posted_date) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP)')
            .getCount();
        return count;
    }
};
PostServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PostServices);
exports.default = PostServices;
