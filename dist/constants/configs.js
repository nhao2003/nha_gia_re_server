"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
class AppConfig {
    isProduction = process.env.NODE_ENV === 'production';
    // public readonly database = {
    //   user: this.isProduction ? process.env.DB_USER : process.env.DB_USER_DEV,
    //   password: this.isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV,
    //   host: this.isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEV,
    //   port: this.isProduction ? process.env.DB_PORT : process.env.DB_PORT_DEV,
    //   name: this.isProduction ? process.env.DATABASE : process.env.DATABASE_DEV,
    // };
    // Use data production
    APP_URL = process.env.APP_URL;
    SMTP_USERNAME = process.env.SMTP_USERNAME;
    SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    database = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DATABASE,
    };
    ZALOPAY_SANDBOX = {
        app_id: process.env.ZALOPAY_SANDBOX_APP_ID,
        key1: process.env.ZALOPAY_SANDBOX_KEY1,
        key2: process.env.ZALOPAY_SANDBOX_KEY2,
        privateKey: process.env.ZALOPAY_SANDBOX_PRIVATE_KEY,
    };
    PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY;
    JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
    CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
    ZALOPAY_API = process.env.ZALOPAY_API;
}
exports.default = new AppConfig();
