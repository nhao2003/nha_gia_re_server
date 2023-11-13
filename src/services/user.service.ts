import { Repository } from 'typeorm/browser';
import { User } from '~/domain/databases/entity/User';
import { UserQuery } from '~/models/UserQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { AppDataSource } from '~/app/database';
import authServices from './auth.services';
import { AppError } from '~/models/Error';
import { UserStatus } from '~/constants/enum';
class UserServices {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
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
    const page = userQuery.page || 1;
    let query = this.userRepository.createQueryBuilder();
    const wheres = userQuery.wheres;
    if (wheres) {
      wheres.forEach((where) => {
        query = query.andWhere(where);
      });
    }
    const orders = userQuery.orders;
    if (orders) {
      query = query.orderBy(orders);
    }
    const total = query.getCount();

    query = query.skip((page - 1) * 10).take(10);
    const users = query.getMany();

    const result = await Promise.all([total, users]);

    return {
      num_of_pages: Math.ceil(result[0] / 10),
      users: result[1],
    };
  }

  async banUser(id: string, ban_reason: string, banned_util: Date): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if(user.status === UserStatus.banned) {
      throw new AppError('User has been banned', 400);
    }
    if(banned_util < new Date()) {
      throw new AppError('Banned util is not valid', 400);
    }
    user.status = UserStatus.banned;
    user.ban_reason = ban_reason;
    user.banned_util = banned_util;
    const ban = this.userRepository.save(user);
    const signOutAll = authServices.signOutAll(id);
    await Promise.all([ban, signOutAll]);
  }

  async unbanUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if(user.status !== UserStatus.banned) {
      throw new AppError('User has not been banned', 400);
    }
    user.status = UserStatus.verified;
    user.ban_reason = null;
    user.banned_util = null;
    await this.userRepository.save(user);
  }
}

export default new UserServices();
