import { Repository } from 'typeorm/browser';
import { User } from '~/domain/databases/entity/User';
import { UserQuery } from '~/models/UserQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { AppDataSource } from '~/app/database';
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
}

export default new UserServices();
