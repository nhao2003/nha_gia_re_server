import { Service } from 'typedi';
import CommonServices from './common.service';
import { DataSource, Repository } from 'typeorm';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import { AppError } from '~/models/Error';

@Service()
export class DiscountCodeService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(DiscountCode, dataSource);
  }
  public create(data: Record<string, any>): Promise<DiscountCode> {
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
    const discountCode =(this.repository as Repository<DiscountCode>).findOne({
      where: {
        code,
      },
    });
    if (discountCode !== undefined || discountCode !== null) {
      throw new AppError('Code is already exist', 400);
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
