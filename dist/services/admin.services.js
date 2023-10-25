"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../constants/enum");
const my_repository_1 = require("../repositories/my_repository");
class AdminService {
    userRepo;
    postRepo;
    constructor() {
        this.userRepo = my_repository_1.MyRepository.userRepository();
        this.postRepo = my_repository_1.MyRepository.postRepository();
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
}
exports.default = new AdminService();
