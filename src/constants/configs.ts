import dotenv from 'dotenv';
dotenv.config({ path: './.env'});
class AppConfig {
  static readonly isProduction = process.env.NODE_ENV === 'production';
  static readonly database = {
    user: this.isProduction ? process.env.DB_USER : process.env.DB_USER_DEV,
    password: this.isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV,
    host: this.isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEV,
    port: this.isProduction ? process.env.DB_PORT : process.env.DB_PORT_DEV,
  };
  static readonly  PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY;
  static readonly  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  static readonly  JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  static readonly  JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
}
export default AppConfig;