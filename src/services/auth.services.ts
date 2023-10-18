// import RefreshToken from "~/models/database/RefreshToken";
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OTPTypes, UserStatus } from '~/constants/enum';
import { Session } from '~/domain/databases/entity/Sesstion';
import { User } from '~/domain/databases/entity/User';
import { MyRepository } from '~/repositories/my_repository';
import { hashPassword, hashString } from '~/utils/crypto';
import { UserPayload, VerifyResult, signToken, verifyToken } from '~/utils/jwt';
import { parseTimeToMilliseconds } from '~/utils/time';

type SignInResult = {
  access_token: string;
  refresh_token: string;
};

class AuthServices {
  private userRepository: any;
  private otpRepository: any;
  private sessionRepository: any;
  constructor() {
    this.userRepository = MyRepository.userRepository();
    this.otpRepository = MyRepository.otpRepository();
    this.sessionRepository = MyRepository.sessionRepository();
  }

  private generateToken(user_id: string, session_id: string): Promise<string> {
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
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp_code);
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY) as string);
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
    return otp_code;
  }

  public async createSession(user_id: string): Promise<SignInResult> {
    const session = await this.sessionRepository.insert({
      user_id,
      expiration_date: new Date(Date.now() + parseTimeToMilliseconds(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string)),
    });
    const refresh_token = await this.generateRefreshToken(user_id, session.identifiers[0].id);
    const access_token = await this.generateToken(user_id, session.identifiers[0].id);
    return { access_token, refresh_token };
  }

  public async signIn(email: string, password: string): Promise<SignInResult | null | undefined> {
    const user = await this.userRepository.findOne({ where: { email, password: hashPassword(password) } });
    if (user === null || user === undefined) return user;
    return await this.createSession(user.id);
  }

  public async verifyOTPCode(user_id: string, otp_code: string, type: string): Promise<boolean> {
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY) as string);
    const otp = await this.otpRepository.findOne({
      where: {
        user_id,
        token,
        type,
        expiration_time: MoreThanOrEqual(new Date()),
        is_used: false,
        is_active: true,
      },
    });
    if (otp) {
      otp.is_used = true;
      otp.is_active = false;
      await this.otpRepository.save(otp);
      return true;
    } else {
      return false;
    }
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

  async checkUserExistByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async checkUserExistByID(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  //Get user by email and password
  async getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined | null> {
    const user = await this.userRepository.findOne({ where: { email, password: hashPassword(password) } });
    return user;
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

  async checkSessionExist(session_id: string): Promise<Session | undefined> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, expiration_date: MoreThanOrEqual(new Date()) },
    });
    return session;
  }
}

export default AuthServices;
