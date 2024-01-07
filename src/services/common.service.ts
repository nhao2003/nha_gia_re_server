import { BaseEntity, DataSource, EntityTarget, Repository } from 'typeorm';
import { BaseQuery as BaseQuery } from '~/models/PostQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { AppError } from '~/models/Error';
import AppConfig from '~/constants/configs';
class CommonServices {
  protected repository: Repository<any>;
  private entity: EntityTarget<any>;
  constructor(entity: EntityTarget<any>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
    this.entity = entity;
  }

  public getRepository() {
    return this.repository;
  }

  public buildBaseQuery(query: Record<string, any>): BaseQuery {
    const { page, orders } = query;
    const handleQuery = {
      ...query,
    };
    delete handleQuery.page;
    delete handleQuery.orders;
    const wheres = buildQuery(handleQuery);
    // Get Name of entity
    const entityName = this.repository.metadata.name;
    return { page, wheres, orders: buildOrder(orders, entityName) };
  }

  public async markDeleted(id: string): Promise<void> {
    const value = await this.repository
      .createQueryBuilder()
      .where({
        id: id,
        is_active: true,
      })
      .setParameters({
        current_user_id: null,
      })
      .getOne();
    if (value === undefined || value === null) {
      throw AppError.notFound();
    }
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
    let { page } = query;
    const { wheres, orders } = query;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
    }
    let devQuery = this.repository.createQueryBuilder();
    if (wheres) {
      wheres.forEach((where) => {
        devQuery = devQuery.andWhere(where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    const res = await Promise.all([getMany, getCount]);
    return {
      num_of_pages: Math.ceil(res[1] / AppConfig.ResultPerPage),
      data: res[0],
    };
  }

  public async create(data: Record<string, any>) {
    return await this.repository.save(data);
  }

  public async update(id: string, data: Record<string, any>): Promise<any> {
    delete data.is_active;
    // const value = await this.repository.findOne({ where: { id: id, is_active: true } });
    const value = await this.repository
      .createQueryBuilder()
      .where({ id: id, is_active: true })
      .setParameters({ current_user_id: null })
      .getOne();

    if (value === undefined || value === null) {
      throw AppError.notFound();
    }
    await this.repository.update(id, data);
  }
}

export default CommonServices;
