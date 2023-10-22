"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRecoveryPasswordEmail = exports.sendConfirmationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
        console.log(info);
    });
};
exports.sendEmail = sendEmail;
const sendConfirmationEmail = async (to, token) => {
    let template = `<!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Xác nhận tài khoản - Nhà Giá Rẻ</title>
    </head>
    <body style="background-color: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0">
      <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="text-align: center; padding: 10px 0">
            <!-- LOGO HERE -->
          </td>
        </tr>
      </table>
  
      <table width="100%" bgcolor="#ffffff" cellpadding="10" cellspacing="0" border="0" style="padding-bottom: 10px">
        <tr>
          <td>
            <div style="text-align: center; margin: 10px">
              <h1>Xác nhận tài khoản</h1>
              <p>Cảm ơn bạn đã đăng ký tài khoản với ứng dụng Nhà Giá Rẻ.</p>
              <p>Xin vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:</p>
              <br />
              <a
                href="{{url}}"
                style="
                  text-decoration: none;
                  background-color: #007bff;
                  color: #ffffff;
                  padding: 15px 20px;
                  border-radius: 5px;
                  font-weight: bold;
                "
                >Xác nhận tài khoản</a
              >
            </div>
          </td>
        </tr>
      </table>
  
      <table width="100%" bgcolor="#f5f5f5" cellpadding="20" cellspacing="0" border="0">
        <tr>
          <td>
            <div style="text-align: center">
              <p>Liên hệ với chúng tôi:</p>
              <a href="mailto:hotro.nhagiare@gmail.com" style="text-decoration: none; color: #333"
                >hotro.nhagiare@gmail.com</a
              >
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
    template = template.replace("{{url}}", "http://localhost:3000/api/v1/auth/verify-email?token=" + token);
    //   template = template.replace("{{host}}", "http://localhost:3000");
    await (0, exports.sendEmail)(to, "Vui lòng xác minh email của bạn", template);
};
exports.sendConfirmationEmail = sendConfirmationEmail;
const sendRecoveryPasswordEmail = async (to, code) => {
    let template = fs_1.default.readFileSync("../templates/recovery-email.html", "utf-8");
    template = template.replace("{{code}}", code);
    await (0, exports.sendEmail)(to, "Mã xác nhận đổi mật khẩu", template);
};
exports.sendRecoveryPasswordEmail = sendRecoveryPasswordEmail;
