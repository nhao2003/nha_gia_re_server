import { DataSource, Repository } from 'typeorm';
import { User } from '~/domain/databases/entity/User';
import { UserQuery } from '~/models/UserQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
import AuthServices from './auth.service';
import { AppError } from '~/models/Error';
import { UserStatus } from '~/constants/enum';
import { Service } from 'typedi';
import { UserFollow } from '~/domain/databases/entity/UserFollow';
import AppConfig from '~/constants/configs';
@Service()
class UserServices {
  private userRepository: Repository<User>;
  private userFollowRepository: Repository<UserFollow>;
  private authServices: AuthServices;
  constructor(dataSource: DataSource, authServices: AuthServices) {
    this.userRepository = dataSource.getRepository(User);
    this.authServices = authServices;
    this.userFollowRepository = dataSource.getRepository(UserFollow);
  }
  async updateUserInfo(user_id: string, data: any): Promise<boolean> {
    await this.userRepository.update(
      { id: user_id },
      {
        ...data,
        updated_at: new Date(),
      },
    );
    return true;
  }

  async getUserInfo(id: string, is_active: boolean = true): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  // Get following users
  async getFollowingUsers(user_id: string): Promise<{
    num_of_following: number;
    num_of_followers: number;
  }> {
    const num_of_following = this.userFollowRepository.count({
      where: { user_id },
    });
    const num_of_followers = this.userFollowRepository.count({
      where: { follow_id: user_id },
    });

    return await Promise.all([num_of_following, num_of_followers]).then((result) => {
      return {
        num_of_following: result[0],
        num_of_followers: result[1],
      };
    });
  }

  async followOrUnfollowUser(user_id: string, follow_id: string): Promise<boolean> {
    const userFollow = await this.userFollowRepository.findOne({ where: { user_id, follow_id } });
    if (userFollow) {
      await this.userFollowRepository.delete({ user_id, follow_id });
      return false;
    } else {
      await this.userFollowRepository.insert({ user_id, follow_id });
      return true;
    }
  }
  buildUserQuery(userQuery: any): UserQuery {
    const { page, orders } = userQuery;
    const handleQuery = {
      ...userQuery,
    };
    delete handleQuery.page;
    delete handleQuery.orders;
    const wheres = buildQuery(handleQuery);
    const buildOrders = buildOrder(orders);
    return { page, wheres, orders: buildOrders };
  }

  async getUserByQuery(userQuery: UserQuery): Promise<{
    num_of_pages: number;
    users: User[];
  }> {
    let { page, wheres, orders } = userQuery;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.RESULT_PER_PAGE;
      take = AppConfig.RESULT_PER_PAGE;
    }
    let query = this.userRepository.createQueryBuilder();
    if (wheres) {
      wheres.forEach((where) => {
        query = query.andWhere(where);
      });
    }
    if (orders) {
      query = query.orderBy(orders);
    }
    const total = query.getCount();

    query = query.skip(skip).take(take);
    const users = query.getMany();

    const result = await Promise.all([total, users]);

    return {
      num_of_pages: Math.ceil(result[0] / AppConfig.RESULT_PER_PAGE),
      users: result[1],
    };
  }

  async banUser(id: string, ban_reason: string, banned_util: Date): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (user.status === UserStatus.banned) {
      throw new AppError('User has been banned', 400);
    }
    if (banned_util < new Date()) {
      throw new AppError('Banned util is not valid', 400);
    }
    user.status = UserStatus.banned;
    user.ban_reason = ban_reason;
    user.banned_util = banned_util;
    
    const ban = this.userRepository.save(user);
    const signOutAll = this.authServices.signOutAll(id);
    await Promise.all([ban, signOutAll]);
  }

  async unbanUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (user.status !== UserStatus.banned) {
      throw new AppError('User has not been banned', 400);
    }
    user.status = UserStatus.verified;
    user.ban_reason = null;
    user.banned_util = null;
    await this.userRepository.save(user);
  }
}

export default UserServices;
