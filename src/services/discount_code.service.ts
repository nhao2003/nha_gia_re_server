import { Service } from 'typedi';
import CommonServices from './common.service';
import { DataSource, Repository } from 'typeorm';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import { AppError } from '~/models/Error';
import HTTP_STATUS from '~/constants/httpStatus';
import ServerCodes from '~/constants/server_codes';

@Service()
export class DiscountCodeService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(DiscountCode, dataSource);
  }
  public async create(data: Record<string, any>): Promise<DiscountCode> {
    const {
      package_id,
      code,
      discount_percent,
      starting_date,
      expiration_date,
      description,
      limited_quantity,
      min_subscription_months,
    } = data;
    const discountCode = await (this.repository as Repository<DiscountCode>).findOne({
      where: {
        code,
      },
    });
    if (discountCode !== null) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Code already exists', {
        serverCode: ServerCodes.DiscountCode.CodeAlreadyExists,
      });
    }
    return (this.repository as Repository<DiscountCode>).save({
      package_id,
      code,
      discount_percent,
      starting_date,
      expiration_date,
      description,
      limited_quantity,
      min_subscription_months,
    });
  }
}
