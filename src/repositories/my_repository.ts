import { BaseEntity, Repository } from 'typeorm';
import { OTP } from '~/domain/databases/entity/OTP';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { Session } from '~/domain/databases/entity/Sesstion';
import { User } from '~/domain/databases/entity/User';

class MyRepository {
  public static userRepository(): Repository<User> {
    return User.getRepository();
  }
  public static otpRepository(): Repository<OTP> {
    return OTP.getRepository();
  }
  public static sessionRepository(): Repository<Session> {
    return Session.getRepository();
  }

  public static postRepository(): Repository<RealEstatePost> {
    return RealEstatePost.getRepository();
  }
}

export { MyRepository };
