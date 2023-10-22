"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRepository = void 0;
const Otp_1 = require("../domain/databases/entity/Otp");
const RealEstatePost_1 = require("../domain/databases/entity/RealEstatePost");
const Sesstion_1 = require("../domain/databases/entity/Sesstion");
const User_1 = require("../domain/databases/entity/User");
class MyRepository {
    static userRepository() {
        return User_1.User.getRepository();
    }
    static otpRepository() {
        return Otp_1.OTP.getRepository();
    }
    static sessionRepository() {
        return Sesstion_1.Session.getRepository();
    }
    static postRepository() {
        return RealEstatePost_1.RealEstatePost.getRepository();
    }
}
exports.MyRepository = MyRepository;
