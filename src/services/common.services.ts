import { BaseEntity, getRepository, Repository } from 'typeorm';
import { User } from '~/domain/databases/entity/User';
import { AppDataSource } from '~/app/database';
import { BaseQuery as BaseQuery } from '~/models/PostQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
class CommonServices {
  private repository: Repository<any>;
  constructor(entity: any) {
    this.repository = entity.getRepository();
  }

  public buildBaseQuery(query: Record<string, any>): BaseQuery {
    const { page, sort_fields, sort_orders } = query;
    const handleQuery = {
      ...query,
    };
    delete handleQuery.page;
    delete handleQuery.sort_fields;
    delete handleQuery.sort_orders;
    const wheres = buildQuery(handleQuery);
    const orders = buildOrder(sort_fields, sort_orders);
    return { page, wheres, orders };
  }

  public async markDeleted(id: string): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getAll(): Promise<BaseEntity[]> {
    return await this.repository.find();
  }

  public async getById(id: string): Promise<BaseEntity> {
    return await this.repository.findOne({
      where: {
        id: id,
        is_active: true,
      },
    });
  }

  public async getAllByQuery(query: BaseQuery) {
    let { page, wheres, orders } = query;
    page = Number(page) || 1;
    const skip = (page - 1) * 10;
    const take = 10;
    let devQuery = this.repository.createQueryBuilder().skip(skip).take(take);
    if (wheres) {
      wheres.forEach((where) => {
        devQuery = devQuery.andWhere(where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    return devQuery.getMany();
  }

  public async create(data: Record<string, any>) {
    return await this.repository.save(data);
  }

  public async update(id: string, data: Record<string, any>) {
    await this.repository.update(id, data);
    return id;
  }
}

export default CommonServices;
