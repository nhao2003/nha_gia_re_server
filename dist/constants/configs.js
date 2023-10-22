"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
class AppConfig {
    static isProduction = process.env.NODE_ENV === 'production';
    static database = {
        user: this.isProduction ? process.env.DB_USER : process.env.DB_USER_DEV,
        password: this.isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV,
        host: this.isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEV,
        port: this.isProduction ? process.env.DB_PORT : process.env.DB_PORT_DEV,
    };
    static PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY;
    static JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    static JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
}
exports.default = AppConfig;
