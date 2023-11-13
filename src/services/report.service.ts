import CommonServices from './common.services';
import Report from '../domain/databases/entity/Report';
import { BaseQuery } from '~/models/PostQuery';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
class ReportService extends CommonServices {
  constructor() {
    super(Report);
  }

  public async getAllByQuery(query: BaseQuery): Promise<{
    num_of_pages: number;
    data: any;
  }> {
    let { page, wheres, orders } = query;
    page = Number(page) || 1;
    const skip = (page - 1) * 10;
    const take = 10;
    let devQuery = this.repository.createQueryBuilder();
    devQuery = devQuery.leftJoinAndSelect('Report.reporter', 'user');
    devQuery = devQuery.setParameters({ current_user_id: null });
    if (wheres) {
      wheres.forEach((where) => {
        if(where === 'type = \'post\'') {
          devQuery = devQuery.leftJoinAndSelect('Report.post', 'post');
        }
        devQuery = devQuery.andWhere('Report.' + where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getRawMany();
    const values_2 = await Promise.all([getCount, getMany]);
    const [count, reports] = values_2;
    return {
      num_of_pages: Math.ceil(count / 10),
      data: reports,
    };
  }
}

export default new ReportService();
