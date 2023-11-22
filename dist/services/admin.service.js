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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const Developer_1 = require("../domain/databases/entity/Developer");
const RealEstatePost_1 = require("../domain/databases/entity/RealEstatePost");
const User_1 = require("../domain/databases/entity/User");
let AdminService = class AdminService {
    userRepo;
    postRepo;
    developerRepo;
    constructor(dataSource) {
        this.userRepo = dataSource.getRepository(User_1.User);
        this.postRepo = dataSource.getRepository(RealEstatePost_1.RealEstatePost);
        this.developerRepo = dataSource.getRepository(Developer_1.Developer);
    }
    async approvePost(id) {
        await this.postRepo.update(id, { status: enum_1.PostStatus.approved, info_message: null });
        return id;
    }
    async rejectPost(id, reason) {
        await this.postRepo.update(id, { status: enum_1.PostStatus.rejected, info_message: reason });
        return id;
    }
    // Delete post
    async deletePost(id) {
        await this.postRepo.update(id, { is_active: false });
        return id;
    }
};
AdminService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
exports.default = AdminService;
