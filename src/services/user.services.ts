import { Repository } from 'typeorm/browser';
import { User } from '~/domain/databases/entity/User';
import { UserQuery } from '~/models/UserQuery';
import { MyRepository } from '~/repositories/my_repository';
import { buildOrder, buildQuery } from '~/utils/build_query';

class UserServices {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = MyRepository.userRepository();
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
    }
    delete handleQuery.page;
    delete handleQuery.orders;
    const wheres = buildQuery(handleQuery);
    const buildOrders = buildOrder(orders);
    return { page, wheres, orders: buildOrders };
  }

  async getUserByQuery(userQuery: UserQuery): Promise<User[]> {
    const page = userQuery.page || 1;
    let query = this.userRepository
      .createQueryBuilder()
      .skip((page - 1) * 10)
      .take(10);
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
    console.log(query.getSql());
    const users = await query.getMany();
    return users;
  }
}

export default new UserServices();
