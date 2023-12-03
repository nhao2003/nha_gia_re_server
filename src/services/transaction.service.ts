import { DataSource } from 'typeorm';
import CommonServices from './common.service';
import Transaction from '~/domain/databases/entity/Transaction';
import { BaseQuery } from '~/models/PostQuery';

export class TransactionService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource);
  }

  public getAllByQuery(query: BaseQuery): Promise<{ num_of_pages: number; data: Transaction[] }> {
    const { page = 1, wheres, orders } = query;
    const skip = (page - 1) * 10;
    const take = 10;
    let devQuery = this.repository.createQueryBuilder().leftJoinAndSelect('Transaction.package', 'package');
    wheres.forEach((where) => {
      devQuery = devQuery.andWhere('Transaction.' + where);
    });
    devQuery = devQuery.orderBy(orders);
    devQuery = devQuery.skip(skip);
    devQuery = devQuery.take(take);
    return devQuery.getManyAndCount().then(([data, count]) => {
      return {
        num_of_pages: Math.ceil(count / 10),
        data,
      };
    });
  }
}
