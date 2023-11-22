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
// import RefreshToken from "~/models/database/RefreshToken";
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const enum_1 = require("../constants/enum");
const Otp_1 = require("../domain/databases/entity/Otp");
const Sesstion_1 = require("../domain/databases/entity/Sesstion");
const User_1 = require("../domain/databases/entity/User");
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const time_1 = require("../utils/time");
const mail_service_1 = __importDefault(require("./mail.service"));
let AuthServices = class AuthServices {
    userRepository;
    otpRepository;
    sessionRepository;
    mailService;
    constructor(dataSource, mailService) {
        this.userRepository = dataSource.getRepository(User_1.User);
        this.otpRepository = dataSource.getRepository(Otp_1.OTP);
        this.sessionRepository = dataSource.getRepository(Sesstion_1.Session);
        this.mailService = mailService;
    }
    /**
     *
     * @param user_id ID of user
     * @param session_id ID of session
     * @returns Access token
     */
    generateAccessToken(user_id, session_id) {
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
        // const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_code = '000000';
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
        await this.mailService.sendConfirmationEmail(email, otp_code);
        return otp_code;
    }
    // Resend OTP code if OPT code is expired
    async resendOTPCode(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user === null)
            return user;
        if (user.status !== enum_1.UserStatus.unverified) {
            throw new Error('User is already active');
        }
        const otp_code = await this.generateOTPCode(enum_1.OTPTypes.account_activation, user.id);
        await this.mailService.sendConfirmationEmail(email, otp_code);
        return otp_code;
    }
    async createSession(user_id) {
        const session = await this.sessionRepository.insert({
            user_id,
            expiration_date: new Date(Date.now() + (0, time_1.parseTimeToMilliseconds)(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)),
        });
        const refresh_token = await this.generateRefreshToken(user_id, session.identifiers[0].id);
        const access_token = await this.generateAccessToken(user_id, session.identifiers[0].id);
        return { access_token, refresh_token, session_id: session.identifiers[0].id };
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
        return this.generateAccessToken(user_id, session_id);
    }
    async getOTP(user_id, otp_code, type) {
        const token = (0, crypto_1.hashString)((otp_code + process.env.OTP_SECRET_KEY + type));
        const otp = await this.otpRepository.findOne({
            where: {
                user_id,
                token,
                type,
                expiration_time: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                is_used: false,
            },
        });
        return otp;
    }
    async verifyOTPCodeAndUse(user_id, otp_code, type) {
        const otp = await this.getOTP(user_id, otp_code, type);
        if (otp === null) {
            return false;
        }
        otp.is_used = true;
        await this.otpRepository.save(otp);
        return true;
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
        const user = await this.userRepository
            .createQueryBuilder()
            .where('id = :id', { id })
            .addSelect('User.password')
            .getOne();
        return user;
    }
    //Get user by email and password
    async getUserByEmailAndPassword(email, password) {
        const user = await this.userRepository
            .createQueryBuilder()
            .addSelect('User.password')
            .where('email = :email', { email })
            .getOne();
        if (user === null) {
            return { user, password_is_correct: false };
        }
        const password_is_correct = (0, crypto_1.hashPassword)(password) === user.password;
        return { user, password_is_correct };
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
            await this.mailService.sendRecoveryPasswordEmail(email, otp_code);
            return otp_code;
        }
        else {
            return null;
        }
    }
    async generateResetPasswordToken(id, session_id) {
        const reset_password_token = await (0, jwt_1.signToken)({
            payload: { id, session_id },
            expiresIn: process.env.RECOVERY_PASSWORD_EXPIRES_IN,
            secretKey: process.env.RECOVERY_PASSWORD_SERECT_KEY,
        });
        return reset_password_token;
    }
    verifyUserByAccessToken = async (access_token) => {
        const { payload, expired } = await (0, jwt_1.verifyToken)(access_token);
        if (expired)
            return null;
        const { user_id } = payload;
        const user = await this.userRepository.findOne({ where: { id: user_id } });
        return user;
    };
};
AuthServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource, mail_service_1.default])
], AuthServices);
exports.default = AuthServices;
