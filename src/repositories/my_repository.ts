import { BaseEntity, Repository } from 'typeorm';
import { OTP } from '~/domain/databases/entity/Otp';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { Session } from '~/domain/databases/entity/Sesstion';
import { User } from '~/domain/databases/entity/User';
import UserPostFavorite from '~/domain/databases/entity/UserPostFavorite';
import UserPostView from '~/domain/databases/entity/UserPostView';

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
  public static userPostFavoriteRepository(): Repository<UserPostFavorite> {
    return UserPostFavorite.getRepository();
  }

  public static userPostViewRepository(): Repository<UserPostView> {
    return UserPostView.getRepository();
  }
}

export { MyRepository };
