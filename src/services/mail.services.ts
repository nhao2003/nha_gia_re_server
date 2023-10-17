import nodemailer from "nodemailer";
import fs from "fs";
import exp from "constants";
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USERNAME as string,
      pass: process.env.SMTP_PASSWORD as string
    }
  });
  await transporter.sendMail(
    {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(info);
    }
  );
};

export const sendConfirmationEmail = async (to: string, token: string) => {
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
  await sendEmail(to, "Vui lòng xác minh email của bạn", template);
};

export const sendRecoveryPasswordEmail = async (to: string, code: string) => {
  let template = fs.readFileSync("../templates/recovery-email.html", "utf-8");
  template = template.replace("{{code}}", code);
  await sendEmail(to, "Mã xác nhận đổi mật khẩu", template);
};

