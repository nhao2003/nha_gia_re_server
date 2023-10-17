import { BaseEntity, Repository } from 'typeorm';
import { OTP } from '~/domain/databases/entity/Otp';
import { Session } from '~/domain/databases/entity/Sesstion';
import { User } from '~/domain/databases/entity/User';

class MyRepository {
  public static userRepository(): Repository<User> {
    return User.getRepository();
  }
  public static otpRepository(): Repository<BaseEntity> {
    return OTP.getRepository();
  }
  public static sessionRepository(): Repository<BaseEntity> {
    return Session.getRepository();
  }
}

export { MyRepository };
