"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __importDefault(require("typedi"));
const typeorm_1 = require("typeorm");
const database_1 = require("../app/database");
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = __importDefault(require("../constants/configs"));
const mail_service_1 = __importDefault(require("../services/mail.service"));
const zalopay_service_1 = __importDefault(require("../services/zalopay.service"));
class DependencyInjection {
    static instance = new DependencyInjection();
    constructor() {
        typedi_1.default.set(typeorm_1.DataSource, database_1.AppDataSource);
        typedi_1.default.set(zalopay_service_1.default, new zalopay_service_1.default());
        typedi_1.default.set(mail_service_1.default, new mail_service_1.default(nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: configs_1.default.SMTP_USERNAME,
                pass: configs_1.default.SMTP_PASSWORD,
            },
        })));
    }
    static getInstance() {
        return DependencyInjection.instance;
    }
    get(type) {
        return typedi_1.default.get(type);
    }
    set(type, value) {
        typedi_1.default.set(type, value);
    }
}
exports.default = DependencyInjection.getInstance();
