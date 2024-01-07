import { DataSource } from 'typeorm';
import CommonServices from './common.service';
import Transaction from '~/domain/databases/entity/Transaction';
import { BaseQuery } from '~/models/PostQuery';
import AppConfig from '~/constants/configs';
export class TransactionService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource);
  }

  public getAllByQuery(query: BaseQuery): Promise<{ num_of_pages: number; data: Transaction[] }> {
    // let { page, wheres, orders } = query;
    let { page } = query;
    const { wheres, orders } = query;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
    }
    let devQuery = this.repository.createQueryBuilder().leftJoinAndSelect('Transaction.package', 'package');
    wheres.forEach((where) => {
      devQuery = devQuery.andWhere('Transaction.' + where);
    });
    devQuery = devQuery.orderBy(orders);
    devQuery = devQuery.skip(skip);
    devQuery = devQuery.take(take);
    return devQuery.getManyAndCount().then(([data, count]) => {
      return {
        num_of_pages: Math.ceil(count / AppConfig.ResultPerPage),
        data,
      };
    });
  }
}
