"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MailService {
    transporter;
    comfirmationEmailTemplate;
    recoveryPasswordEmailTemplate;
    constructor(transporter) {
        this.transporter = transporter;
        this.comfirmationEmailTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', 'assets', 'templates', 'confirmation-email.html'), 'utf-8');
        this.recoveryPasswordEmailTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', 'assets', 'templates', 'recovery-email.html'), 'utf-8');
    }
    async sendMail(to, subject, html) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject,
                html,
            }, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async sendConfirmationEmail(to, code) {
        const template = this.comfirmationEmailTemplate.replace('{{CODE}}', code);
        await this.sendMail(to, 'Vui lòng xác minh email của bạn', template);
    }
    async sendRecoveryPasswordEmail(to, code) {
        const template = this.recoveryPasswordEmailTemplate.replace('{{code}}', code);
        await this.sendMail(to, 'Mã xác nhận đổi mật khẩu', template);
    }
}
exports.default = MailService;
