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
const server_codes_1 = __importDefault(require("../constants/server_codes"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const typedi_1 = require("typedi");
const post_service_1 = __importDefault(require("../services/post.service"));
let AdminValidation = class AdminValidation {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    checkPostExisted = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                status: 'error',
                code: server_codes_1.default.AdminCode.MissingRequiredFields,
                message: 'Missing post_id in request body',
                result: null,
            });
        }
        const post = await this.postService.getPostById(id);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                code: server_codes_1.default.AdminCode.NotFound,
                message: 'Post not found',
                result: null,
            });
        }
        req.post = post;
        next();
    });
};
AdminValidation = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [post_service_1.default])
], AdminValidation);
exports.default = AdminValidation;
