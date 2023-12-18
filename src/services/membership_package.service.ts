import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import CommonServices from './common.service';
import { DataSource, Repository } from 'typeorm';
import Subscription from '~/domain/databases/entity/Subscription ';
import { User } from '~/domain/databases/entity/User';
import { AppDataSource } from '~/app/database';
import { Service } from 'typedi';

@Service()
class MembershipPackageServices extends CommonServices {
  private subscriptionPackageRepository: Repository<Subscription>;
  private userRepository: Repository<User>;
  private membershipPackageRepository: Repository<MembershipPackage>;
  constructor(dataSource: DataSource) {
    super(MembershipPackage, dataSource);
    this.subscriptionPackageRepository = dataSource.getRepository(Subscription);
    this.userRepository = dataSource.getRepository(User);
    this.membershipPackageRepository = dataSource.getRepository(MembershipPackage);
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
      .leftJoinAndSelect('Subscription.transaction', 'transaction');

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
    if (email && email !== '') {
      query.andWhere('email = :email', { email });
    }
    if (phone && phone !== '') {
      query.andWhere('phone = :phone', { phone });
    }
    if (user_id && user_id !== '') {
      query.andWhere('id = :user_id', { user_id });
    }
    const result = await Promise.all([query.getOne(), this.getCurrentUserSubscriptionPackage(user_id, email, phone)]);
    return {
      user: result[0],
      subscription: result[1],
    };
  };

  public create(data: Record<string, any>): Promise<MembershipPackage> {
    const membershipPackage = new MembershipPackage();
    membershipPackage.name = data.name;
    membershipPackage.price_per_month = data.price_per_month;
    membershipPackage.description = data.description;
    membershipPackage.monthly_post_limit = data.monthly_post_limit;
    membershipPackage.display_priority_point = data.display_priority_point;
    membershipPackage.post_approval_priority_point = data.post_approval_priority_point;
    return this.membershipPackageRepository.save(membershipPackage);
  }

  public async update(id: string, data: Record<string, any>): Promise<MembershipPackage> {
    const membershipPackage = await (this.membershipPackageRepository as Repository<MembershipPackage>).findOne({
      where: { id: id },
    });
    if (!membershipPackage) {
      throw new Error('Membership package not found');
    }
    membershipPackage.id = id;
    membershipPackage.name = data.name;
    membershipPackage.price_per_month = data.price_per_month;
    membershipPackage.description = data.description;
    membershipPackage.monthly_post_limit = data.monthly_post_limit;
    membershipPackage.display_priority_point = data.display_priority_point;
    membershipPackage.post_approval_priority_point = data.post_approval_priority_point;
    await this.membershipPackageRepository.save(membershipPackage);
    return membershipPackage;
  }

  public async countSubscriptionPackage(): Promise<any> {
//     SELECT
//   mp.id AS package_id,
//   mp.name AS package_name,
//   COUNT(s.id) AS subscription_count
// FROM
//   membership_packages mp
// LEFT JOIN
//   subscriptions s ON mp.id = s.package_id
// GROUP BY
//   mp.id, mp.name
// ORDER BY
//   mp.id;
    const query = this.membershipPackageRepository
      .createQueryBuilder('membership_package')
      .select('membership_package.id', 'package_id')
      .addSelect('membership_package.name', 'package_name')
      .addSelect('COUNT(subscription.id)', 'subscription_count')
      .leftJoin('membership_package.subscriptions', 'subscription')
      .groupBy('membership_package.id')
      .addGroupBy('membership_package.name')
      .orderBy('membership_package.id');
    const result = await query.getRawMany();
    return result;
  }
}

export default MembershipPackageServices;
