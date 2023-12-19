// import RefreshToken from "~/models/database/RefreshToken";
import { Service } from 'typedi';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { OTPTypes, UserStatus } from '~/constants/enum';
import { OTP } from '~/domain/databases/entity/Otp';
import { Session } from '~/domain/databases/entity/Sesstion';
import { User } from '~/domain/databases/entity/User';
import { hashPassword, hashString } from '~/utils/crypto';
import { UserPayload, signToken, verifyToken } from '~/utils/jwt';
import { parseTimeToMilliseconds } from '~/utils/time';
import MailService from './mail.service';

type SignInResult = {
  access_token: string;
  refresh_token: string;
  session_id: string;
};

@Service()
class AuthServices {
  private userRepository: Repository<User>;
  private otpRepository: Repository<OTP>;
  private sessionRepository: Repository<Session>;
  private mailService: MailService;
  constructor(dataSource: DataSource, mailService: MailService) {
    this.userRepository = dataSource.getRepository(User);
    this.otpRepository = dataSource.getRepository(OTP);
    this.sessionRepository = dataSource.getRepository(Session);
    this.mailService = mailService;
  }

  /**
   *
   * @param user_id ID of user
   * @param session_id ID of session
   * @returns Access token
   */
  private generateAccessToken(user_id: string, session_id: string): Promise<string> {
    return signToken({
      payload: { user_id, session_id },
      expiresIn: process.env.JWT_TOKEN_EXPIRES_IN as string,
    });
  }

  private async generateRefreshToken(user_id: string, session_id: string): Promise<string> {
    return await signToken({
      payload: { user_id, session_id },
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    });
  }

  /**
   *
   * @param type OTPTypes enum
   * @param user_id ID of user
   * @param expiration_time Expiration time of OTP code. Default is 5 minutes
   * @returns OTP code (6 digits)
   */
  private async generateOTPCode(
    type: string,
    user_id: string,
    expiration_time: string = process.env.OTP_EXPIRES_IN as string,
  ): Promise<string> {
    // const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_code = '000000';
    console.log(otp_code);
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY + type) as string);
    // Save OTP code to database
    await this.otpRepository.insert({
      type,
      user_id,
      token,
      expiration_time: new Date(Date.now() + parseTimeToMilliseconds(expiration_time)),
    });
    return otp_code;
  }

  /**
   *
   * @param email Email of user
   * @param password Password of user
   * @returns Comfirmation token
   */
  public async signUp(email: string, password: string): Promise<string> {
    const user = await this.userRepository.insert({ email, password: hashPassword(password) });
    const user_id = user.identifiers[0].id;
    const otp_code = await this.generateOTPCode(OTPTypes.account_activation, user_id);
    // await this.mailService.sendConfirmationEmail(email, otp_code);
    return otp_code;
  }

  // Resend OTP code if OPT code is expired
  public async resendOTPCode(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user === null) return user;
    if (user.status !== UserStatus.unverified) {
      throw new Error('User is already active');
    }

    const otp_code = await this.generateOTPCode(OTPTypes.account_activation, user.id);
    //await this.mailService.sendConfirmationEmail(email, otp_code);
    return otp_code;
  }

  public async createSession(user_id: string): Promise<SignInResult> {
    const session = await this.sessionRepository.insert({
      user_id,
      expiration_date: new Date(
        Date.now() + parseTimeToMilliseconds(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string),
      ),
    });
    const refresh_token = await this.generateRefreshToken(user_id, session.identifiers[0].id);
    const access_token = await this.generateAccessToken(user_id, session.identifiers[0].id);
    return { access_token, refresh_token, session_id: session.identifiers[0].id };
  }

  public async signIn(email: string, password: string): Promise<SignInResult | null | undefined> {
    const user = await this.userRepository.findOne({ where: { email, password: hashPassword(password) } });
    if (user === null || user === undefined) return user;
    return await this.createSession(user.id);
  }

  public async grantNewAccessToken(refresh_token: string): Promise<string | null | undefined> {
    const { payload, expired } = await verifyToken(refresh_token);
    if (expired) return null;
    const { user_id, session_id } = payload as UserPayload;
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, user_id, expiration_date: MoreThanOrEqual(new Date()) },
    });
    if (session === null || session === undefined) return session;
    session.updated_at = new Date();
    await this.sessionRepository.save(session);
    return this.generateAccessToken(user_id, session_id);
  }

  public async getOTP(user_id: string, otp_code: string, type: string): Promise<OTP | null> {
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY + type) as string);
    const otp = await this.otpRepository.findOne({
      where: {
        user_id,
        token,
        type,
        expiration_time: MoreThanOrEqual(new Date()),
        is_used: false,
      },
    });
    return otp;
  }

  public async verifyOTPCodeAndUse(user_id: string, otp_code: string, type: string): Promise<boolean> {
    const otp = await this.getOTP(user_id, otp_code, type);
    if (otp === null) {
      return false;
    }
    otp.is_used = true;
    await this.otpRepository.save(otp);
    return true;
  }

  public async activeAccount(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user && user.status === UserStatus.unverified) {
      user.status = UserStatus.not_update;
      await this.userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  async checkUserExistByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async checkUserExistByID(id: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .addSelect('User.password')
      .getOne();
    return user;
  }

  //Get user by email and password
  async getUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<{
    user: User | null;
    password_is_correct: boolean;
  }> {
    const user = await this.userRepository
      .createQueryBuilder()
      .addSelect('User.password')
      .where('email = :email', { email })
      .getOne();
    if (user === null) {
      return { user, password_is_correct: false };
    }
    const password_is_correct = hashPassword(password) === user.password;
    return { user, password_is_correct };
  }

  async signOut(session_id: string) {
    const session = await this.sessionRepository.findOne({ where: { id: session_id } });
    if (session) {
      //Delete session
      await this.sessionRepository.delete({ id: session.id });
    }
  }
  async signOutAll(user_id: string) {
    //Delete all session of user
    await this.sessionRepository.delete({ user_id });
  }

  async checkSessionExist(session_id: string): Promise<Session | undefined | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, expiration_date: MoreThanOrEqual(new Date()) },
    });
    return session;
  }

  async changePassword(user_id: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (user) {
      user.password = hashPassword(password);
      await this.userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }
  async forgetPassword(email: string): Promise<string | null | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const otp_code = await this.generateOTPCode(OTPTypes.password_recovery, user.id);
      //await this.mailService.sendRecoveryPasswordEmail(email, otp_code)
      return otp_code;
    } else {
      return null;
    }
  }

  async generateResetPasswordToken(id: string, session_id: string): Promise<string | null> {
    const reset_password_token = await signToken({
      payload: { id, session_id },
      expiresIn: process.env.RECOVERY_PASSWORD_EXPIRES_IN as string,
      secretKey: process.env.RECOVERY_PASSWORD_SERECT_KEY as string,
    });
    return reset_password_token;
  }

  verifyUserByAccessToken = async (access_token: string): Promise<User | null> => {
    const { payload, expired } = await verifyToken(access_token);
    if (expired) return null;
    const { user_id } = payload as UserPayload;
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    return user;
  }
}

export default AuthServices;
