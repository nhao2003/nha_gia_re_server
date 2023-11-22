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
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const post_service_1 = __importDefault(require("../services/post.service"));
const Features_1 = require("../domain/typing/Features");
const address_1 = __importDefault(require("../domain/typing/address"));
const Error_1 = require("../models/Error");
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const message_1 = require("../constants/message");
const typedi_1 = require("typedi");
let PostController = class PostController {
    postServices;
    constructor(postServices) {
        this.postServices = postServices;
    }
    createPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const data = {
            type_id: req.body.type_id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            desposit: req.body.desposit,
            area: req.body.area,
            is_lease: req.body.is_lease,
            is_pro_seller: req.body.is_pro_seller,
            images: req.body.images,
            videos: Array.isArray(req.body.videos) && req.body.videos.length > 0 ? req.body.videos : null,
            address: address_1.default.fromJSON(req.body.address),
            features: Features_1.PropertyFeatures.fromJson({
                type_id: req.body.type_id,
                ...req.body.features,
            }),
            user_id: req.user.id,
            project: req.body.project,
        };
        const post = await this.postServices.createPost(data);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.CREATE_POST_SUCCESSFULLY,
            result: post,
        };
        res.status(200).json(appRes);
    });
    updatePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const post = req.post;
        const data = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            desposit: req.body.desposit,
            area: req.body.area,
            is_lease: req.body.is_lease,
            is_pro_seller: req.body.is_pro_seller,
            images: req.body.images,
            videos: Array.isArray(req.body.videos) && req.body.videos.length ? req.body.videos : null,
            address: address_1.default.fromJSON(req.body.address),
            features: Features_1.PropertyFeatures.fromJson({
                type_id: req.body.type_id,
                ...req.body.features,
            }),
            project: req.body.project,
        };
        const updatedPost = await this.postServices.updatePost(req.params.id, data);
        // res.status(200).json(updatedPost);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UPDATE_POST_SUCCESSFULLY,
            result: updatedPost,
        };
        res.status(200).json(appRes);
    });
    deletePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const post = req.post;
        if (post.is_active === false) {
            return next(new Error_1.AppError('Post is already deleted', 400));
        }
        await this.postServices.deletePost(req.params.id);
        // res.status(200).json({ message: 'Delete success' });
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.DELETE_POST_SUCCESSFULLY,
        };
        res.status(200).json(appRes);
    });
    getAllPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = this.postServices.buildPostQuery(req.query);
        const posts = await this.postServices.getPostsByQuery(query, req.user?.id);
        // return res.json(posts);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
            num_of_pages: posts.numberOfPages,
            result: posts.data,
        };
        res.status(200).json(appRes);
    });
    getPostById = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.params.id;
        const query = {
            'post.id[eq]': `'` + id + `'`,
            'post.expiry_date[gte]': `'${new Date().toJSON()}'`,
            'post.is_active[eq]': 'eq:true',
            'user.status[eq]': "'verified'",
        };
        const postQuery = this.postServices.buildPostQuery(query);
        const { data, numberOfPages } = await this.postServices.getPostsByQuery(postQuery, req.user ? req.user.id : null);
        let appRes;
        if (data.length === 0) {
            appRes = {
                status: 'fail',
                code: server_codes_1.default.PostCode.PostNotFound,
                message: message_1.APP_MESSAGES.POST_NOT_FOUND,
            };
            return res.status(404).json(appRes);
        }
        else {
            appRes = {
                status: 'success',
                code: server_codes_1.default.PostCode.Success,
                message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.GET_POST_SUCCESSFULLY,
                result: data,
            };
            return res.status(200).json(appRes);
        }
    });
    // Mark read post
    markReadPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.params.id;
        const post = await this.postServices.markReadPost(id, req.user.id);
        const appRes = {
            status: 'success',
            code: server_codes_1.default.PostCode.Success,
            message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.MARK_READ_POST_SUCCESSFULLY,
            result: post,
        };
        res.status(200).json(appRes);
    });
    // Favorite post
    favoritePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.params.id;
        const post = await this.postServices.toggleFavorite(id, req.user.id);
        if (post === false) {
            const appRes = {
                status: 'success',
                code: server_codes_1.default.PostCode.Success,
                message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.UNFAVORITE_POST_SUCCESSFULLY,
            };
            res.status(200).json(appRes);
        }
        else {
            const appRes = {
                status: 'success',
                code: server_codes_1.default.PostCode.Success,
                message: message_1.APP_MESSAGES.SUCCESS_MESSAGE.FAVORITE_POST_SUCCESSFULLY,
            };
            res.status(200).json(appRes);
        }
    });
};
PostController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [post_service_1.default])
], PostController);
exports.default = PostController;
