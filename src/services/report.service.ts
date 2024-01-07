import CommonServices from './common.service';
import Report from '../domain/databases/entity/Report';
import { BaseQuery } from '~/models/PostQuery';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';
import { AppError } from '~/models/Error';
import { ReportStatus } from '~/constants/enum';
import { DataSource } from 'typeorm';
import { Service } from 'typedi';
import AppConfig from '~/constants/configs';
import ServerCodes from '~/constants/server_codes';
@Service()
class ReportService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Report, dataSource);
  }

  public async getAllByQuery(query: BaseQuery): Promise<{
    num_of_pages: number;
    data: any;
  }> {
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
      num_of_pages: Math.ceil(count / AppConfig.ResultPerPage),
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
      // throw new AppError('Status is not valid', 400);
      throw AppError.badRequest(ServerCodes.CommomCode.InvalidField, 'Status is not valid');
    }
    if (report.status !== ReportStatus.pending) {
      // throw new AppError('Report has been processed', 400);
      throw AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'Report has been processed');
    }
    if (!report) {
      // throw new AppError('Report not found', 404);
      throw AppError.notFound();
    }
    report.status = status;
    return await this.repository.save(report);
  };

  // Count report per status
  countReportPerStatus = async () => {
    const report = await this.repository
      .createQueryBuilder('report')
      .select('report.status, COUNT(report.status) as count')
      .groupBy('report.status')
      .getRawMany();
    return report;
  };
}

export default ReportService;
