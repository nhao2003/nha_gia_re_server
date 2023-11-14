import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import CommonServices from './common.services';
import { Repository } from 'typeorm';
import Subscription from '~/domain/databases/entity/Subscription ';
import { User } from '~/domain/databases/entity/User';
import { AppDataSource } from '~/app/database';

class MembershipPackageServices extends CommonServices {
  private subscriptionPackageRepository: Repository<Subscription>;
  private userRepository: Repository<User>;
  constructor() {
    super(MembershipPackage);
    this.subscriptionPackageRepository = AppDataSource.getRepository(Subscription);
    this.userRepository = AppDataSource.getRepository(User);
  }
  public async getCurrentUserSubscriptionPackage(user_id?: string, email?: string, phone?: string) {
    if (!user_id && !email && !phone) return null;
    let query = this.subscriptionPackageRepository
      .createQueryBuilder()
      .andWhere({
        is_active: true,
      })
      .leftJoinAndSelect('Subscription.membership_package', 'membership_package')
      .leftJoinAndSelect('Subscription.user', 'user')
      .leftJoinAndSelect('Subscription.transaction', 'transaction')

    if (user_id) {
      query = query.andWhere('Subscription.user_id = :user_id', { user_id });
    }
    if (email) {
      query = query.andWhere('user.email = :email', { email });
    }
    if (phone) {
      query = query.andWhere('user.phone = :phone', { phone });
    }
    const subscriptionPackage = await query.getOne();
    return subscriptionPackage;
  }

  public readonly getUserWithSubscriptionPackage = async (email?: string, phone?: string, user_id?: string) => {
    const query = this.userRepository.createQueryBuilder().where('status = :status', { status: 'verified' });
    if (email && email !== "") {
      query.andWhere('email = :email', { email });
    }
    if (phone && phone !== "") {
      query.andWhere('phone = :phone', { phone });
    }
    if (user_id && user_id !== "") {
      query.andWhere('id = :user_id', { user_id });
    }
    const result = await Promise.all([query.getOne(), this.getCurrentUserSubscriptionPackage(user_id, email, phone)]);
    return {
      user: result[0],
      subscription: result[1],
    };
  };
}

export default new MembershipPackageServices();
