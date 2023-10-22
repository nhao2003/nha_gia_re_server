"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import RefreshToken from "~/models/database/RefreshToken";
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const my_repository_1 = require("../repositories/my_repository");
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const time_1 = require("../utils/time");
class AuthServices {
    userRepository;
    otpRepository;
    sessionRepository;
    constructor() {
        this.userRepository = my_repository_1.MyRepository.userRepository();
        this.otpRepository = my_repository_1.MyRepository.otpRepository();
        this.sessionRepository = my_repository_1.MyRepository.sessionRepository();
    }
    /**
     *
     * @param user_id ID of user
     * @param session_id ID of session
     * @returns Access token
     */
    generateToken(user_id, session_id) {
        return (0, jwt_1.signToken)({
            payload: { user_id, session_id },
            expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
        });
    }
    async generateRefreshToken(user_id, session_id) {
        return await (0, jwt_1.signToken)({
            payload: { user_id, session_id },
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        });
    }
    /**
     *
     * @param type OTPTypes enum
     * @param user_id ID of user
     * @param expiration_time Expiration time of OTP code. Default is 5 minutes
     * @returns OTP code (6 digits)
     */
    async generateOTPCode(type, user_id, expiration_time = process.env.OTP_EXPIRES_IN) {
        const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp_code);
        const token = (0, crypto_1.hashString)((otp_code + process.env.OTP_SECRET_KEY + type));
        // Save OTP code to database
        await this.otpRepository.insert({
            type,
            user_id,
            token,
            expiration_time: new Date(Date.now() + (0, time_1.parseTimeToMilliseconds)(expiration_time)),
        });
        return otp_code;
    }
    /**
     *
     * @param email Email of user
     * @param password Password of user
     * @returns Comfirmation token
     */
    async signUp(email, password) {
        const user = await this.userRepository.insert({ email, password: (0, crypto_1.hashPassword)(password) });
        const user_id = user.identifiers[0].id;
        const otp_code = await this.generateOTPCode(enum_1.OTPTypes.account_activation, user_id);
        return otp_code;
    }
    async createSession(user_id) {
        const session = await this.sessionRepository.insert({
            user_id,
            expiration_date: new Date(Date.now() + (0, time_1.parseTimeToMilliseconds)(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)),
        });
        const refresh_token = await this.generateRefreshToken(user_id, session.identifiers[0].id);
        const access_token = await this.generateToken(user_id, session.identifiers[0].id);
        return { access_token, refresh_token };
    }
    async signIn(email, password) {
        const user = await this.userRepository.findOne({ where: { email, password: (0, crypto_1.hashPassword)(password) } });
        if (user === null || user === undefined)
            return user;
        return await this.createSession(user.id);
    }
    async grantNewAccessToken(refresh_token) {
        const { payload, expired } = await (0, jwt_1.verifyToken)(refresh_token);
        if (expired)
            return null;
        const { user_id, session_id } = payload;
        const session = await this.sessionRepository.findOne({
            where: { id: session_id, user_id, expiration_date: (0, typeorm_1.MoreThanOrEqual)(new Date()) },
        });
        if (session === null || session === undefined)
            return session;
        session.updated_at = new Date();
        await this.sessionRepository.save(session);
        return this.generateToken(user_id, session_id);
    }
    async verifyOTPCode(user_id, otp_code, type) {
        const token = (0, crypto_1.hashString)((otp_code + process.env.OTP_SECRET_KEY + type));
        const otp = await this.otpRepository.findOne({
            where: {
                user_id,
                token,
                type,
                expiration_time: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                is_used: false,
                is_active: true,
            },
        });
        if (otp) {
            otp.is_used = true;
            otp.is_active = false;
            await this.otpRepository.save(otp);
            return true;
        }
        else {
            return false;
        }
    }
    async activeAccount(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user && user.status === enum_1.UserStatus.unverified) {
            user.status = enum_1.UserStatus.not_update;
            await this.userRepository.save(user);
            return true;
        }
        else {
            return false;
        }
    }
    async checkUserExistByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }
    async checkUserExistByID(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }
    //Get user by email and password
    async getUserByEmailAndPassword(email, password) {
        const user = await this.userRepository.findOne({ where: { email, password: (0, crypto_1.hashPassword)(password) } });
        return user;
    }
    async signOut(session_id) {
        const session = await this.sessionRepository.findOne({ where: { id: session_id } });
        if (session) {
            //Delete session
            await this.sessionRepository.delete({ id: session.id });
        }
    }
    async signOutAll(user_id) {
        //Delete all session of user
        await this.sessionRepository.delete({ user_id });
    }
    async checkSessionExist(session_id) {
        const session = await this.sessionRepository.findOne({
            where: { id: session_id, expiration_date: (0, typeorm_1.MoreThanOrEqual)(new Date()) },
        });
        return session;
    }
    async changePassword(user_id, password) {
        const user = await this.userRepository.findOne({ where: { id: user_id } });
        if (user) {
            user.password = (0, crypto_1.hashPassword)(password);
            await this.userRepository.save(user);
            return true;
        }
        else {
            return false;
        }
    }
    async forgetPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const otp_code = await this.generateOTPCode(enum_1.OTPTypes.password_recovery, user.id);
            return otp_code;
        }
        else {
            return null;
        }
    }
}
exports.default = AuthServices;
