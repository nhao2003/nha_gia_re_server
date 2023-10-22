"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const my_repository_1 = require("../repositories/my_repository");
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
        const user = await this.userRepository.findOne({ where: { id, is_active } });
        return user;
    }
}
exports.default = new UserServices();
