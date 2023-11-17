import CommonServices from './common.services';
import Report from '../domain/databases/entity/Report';
import { BaseQuery } from '~/models/PostQuery';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';
import { AppError } from '~/models/Error';
import { ReportStatus } from '~/constants/enum';
import { DataSource } from 'typeorm';
import { Service } from 'typedi';
@Service()
class ReportService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Report, dataSource);
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
        if (where === "type = 'post'") {
          devQuery = devQuery.leftJoinAndMapOne(
            'Report.reported',
            RealEstatePost,
            'RealEstatePost',
            'RealEstatePost.id = Report.reported_id',
          );
        } else if (where === "type = 'user'") {
          devQuery = devQuery.leftJoinAndMapOne('Report.reported', User, 'User', 'User.id = Report.reported_id');
        }
        devQuery = devQuery.andWhere('Report.' + where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    const values_2 = await Promise.all([getCount, getMany]);
    const [count, reports] = values_2;
    return {
      num_of_pages: Math.ceil(count / 10),
      data: reports,
    };
  }

  updateReportStatus = async (id: string, status: ReportStatus) => {
    const report = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!Object.values(ReportStatus).includes(status) || status === ReportStatus.pending) {
      throw new AppError('Status is not valid', 400);
    }
    if (report.status !== ReportStatus.pending) {
      throw new AppError('Report has been processed', 400);
    }
    if (!report) {
      throw new AppError('Report not found', 404);
    }
    report.status = status;
    return await this.repository.save(report);
  };
}

export default ReportService;
