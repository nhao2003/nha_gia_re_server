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
import ServerCodes from '~/constants/server_codes';
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

  async checkFollowUser(user_id: string, follow_id: string): Promise<boolean> {
    const userFollow = await this.userFollowRepository.findOne({ where: { user_id, follow_id } });
    return userFollow ? true : false;
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
    // let { page, wheres, orders } = userQuery;
    let { page } = userQuery;
    const { wheres, orders } = userQuery;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
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
      num_of_pages: Math.ceil(result[0] / AppConfig.ResultPerPage),
      users: result[1],
    };
  }

  async banUser(id: string, ban_reason: string, banned_util: Date): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      // throw new AppError('User not found', 404);
      throw AppError.notFound();
    }
    if (user.status === UserStatus.banned) {
      // throw new AppError('User has been banned', 400);
      throw AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'User has been banned');
    }
    if (banned_util < new Date()) {
      // throw new AppError('Banned util is not valid', 400);
      throw AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'Banned util is not valid');
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
      // throw new AppError('User not found', 404);
      throw AppError.notFound();
    }
    if (user.status !== UserStatus.banned) {
      // throw new AppError('User has not been banned', 400);
      throw AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'User has not been banned');
    }
    user.status = UserStatus.verified;
    user.ban_reason = null;
    user.banned_util = null;
    await this.userRepository.save(user);
  }

  // Count user per status
  async countUserPerStatus(): Promise<{
    num_of_verified: number;
    num_of_banned: number;
    num_of_unverified: number;
  }> {
    const num_of_verified = this.userRepository.count({
      where: { status: UserStatus.verified },
    });
    const num_of_banned = this.userRepository.count({
      where: { status: UserStatus.banned },
    });
    const num_of_unverified = this.userRepository.count({
      where: { status: UserStatus.unverified },
    });

    return await Promise.all([num_of_verified, num_of_banned, num_of_unverified]).then((result) => {
      return {
        num_of_verified: result[0],
        num_of_banned: result[1],
        num_of_unverified: result[2],
      };
    });
  }

  //Count user by identity verified
  async countUserByIdentityVerified(): Promise<{
    num_of_identity_verified: number;
    num_of_identity_not_verified: number;
  }> {
    const num_of_identity_verified = this.userRepository.count({
      where: { is_identity_verified: true },
    });
    const num_of_identity_not_verified = this.userRepository.count({
      where: { is_identity_verified: false },
    });

    return await Promise.all([num_of_identity_verified, num_of_identity_not_verified]).then((result) => {
      return {
        num_of_identity_verified: result[0],
        num_of_identity_not_verified: result[1],
      };
    });
  }
}

export default UserServices;
