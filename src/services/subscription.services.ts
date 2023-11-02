import { MoreThanOrEqual, Repository } from 'typeorm';
import Subscription from '~/domain/databases/entity/Subscription ';
import { User } from '~/domain/databases/entity/User';
import { AppError } from '~/models/Error';
import CommonServices from './common.services';

export type CreateSubscription = {
  user_id: string;
  package_id: string;
  starting_date: Date;
  expiration_date: Date;
  transaction_id?: string | null;
};

class SubscriptionService extends CommonServices {
  private subcritpionRepository: Repository<Subscription>;
  private userRepository: Repository<User>;

  constructor() {
    super(Subscription);
    this.subcritpionRepository = Subscription.getRepository();
    this.userRepository = User.getRepository();
  }

  public async checkUserHasSubscription(user_id: string): Promise<Subscription | null> {
    const res = this.subcritpionRepository.findOne({
      where: { user_id, expiration_date: MoreThanOrEqual(new Date()), is_active: true },
    });
    return res;
  }
  public async createSubscription(create: CreateSubscription): Promise<String> {
    const res = await this.subcritpionRepository.insert({
      user_id: create.user_id,
      package_id: create.package_id,
      starting_date: create.starting_date.toISOString(),
      expiration_date: create.expiration_date.toISOString(),
      transaction_id: create.transaction_id,
      is_active: true,
    });
    return res.identifiers[0].id;
  }

  public async unsubscribe(user_id: string): Promise<boolean> {
    const subscription = await this.checkUserHasSubscription(user_id);
    if (!subscription) {
      return false;
    }
    await this.markDeleted(subscription.id);
    return true;
  }
}
export default new SubscriptionService();