import dotenv from 'dotenv';
dotenv.config({ path: './.env'});
class AppConfig {
  public readonly isProduction = process.env.NODE_ENV === 'production';
  // public readonly database = {
  //   user: this.isProduction ? process.env.DB_USER : process.env.DB_USER_DEV,
  //   password: this.isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV,
  //   host: this.isProduction ? process.env.DB_HOST : process.env.DB_HOST_DEV,
  //   port: this.isProduction ? process.env.DB_PORT : process.env.DB_PORT_DEV,
  //   name: this.isProduction ? process.env.DATABASE : process.env.DATABASE_DEV,
  // };
  // Use data production
  public readonly APP_URL = process.env.APP_URL;
  public readonly database = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DATABASE,
  };
  public readonly ZALOPAY_SANDBOX = {
    app_id: process.env.ZALOPAY_SANDBOX_APP_ID,
    key1: process.env.ZALOPAY_SANDBOX_KEY1,
    key2: process.env.ZALOPAY_SANDBOX_KEY2,

    privateKey: process.env.ZALOPAY_SANDBOX_PRIVATE_KEY,
  }

  public readonly  PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY;
  public readonly  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  public readonly  JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  public readonly  JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
  public readonly CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  public readonly CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  public readonly CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
  public readonly ZALOPAY_API = process.env.ZALOPAY_API;
}
export default new AppConfig();