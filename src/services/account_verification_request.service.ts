import { Service } from 'typedi';
import CommonServices from './common.service';
import { AccountVerificationRequest } from '~/domain/databases/entity/AccountVerificationRequest';
import { DataSource, Repository } from 'typeorm';
import { BaseQuery } from '~/models/PostQuery';
import AppConfig from '~/constants/configs';
import { AppError } from '~/models/Error';
import { User } from '~/domain/databases/entity/User';
@Service()
class AccountVerificationRequestService extends CommonServices {
  private accountVerificationRequestRepository: Repository<AccountVerificationRequest>;
  private userRepository: Repository<User>;
  constructor(dataSource: DataSource) {
    super(AccountVerificationRequest, dataSource);
    this.accountVerificationRequestRepository = this.repository as Repository<AccountVerificationRequest>;
    this.userRepository = dataSource.getRepository(User);
  }

  public async getAllByQuery(query: BaseQuery): Promise<{ num_of_pages: number; data: AccountVerificationRequest[] }> {
    let { page, wheres, orders } = query;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.RESULT_PER_PAGE;
      take = AppConfig.RESULT_PER_PAGE;
    }
    let devQuery = this.accountVerificationRequestRepository
      .createQueryBuilder()
      .leftJoinAndSelect('AccountVerificationRequest.user', 'user');
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
      num_of_pages: Math.ceil(res[1] / AppConfig.RESULT_PER_PAGE),
      data: res[0],
    };
  }

  public async updateRequest(id: string, is_verified: boolean, rejected_info: string | null): Promise<void> {
    if (!is_verified && rejected_info?.length === 0) {
      throw new AppError('rejected_info cannot be empty', 400);
    }

    if (is_verified && rejected_info) {
      throw new AppError('rejected_info must be null when is_verified is true', 400);
    }

    if (is_verified) {
      //   await this.userRepository.update({ id }, { is_identity_verified: true });
      //   return await this.accountVerificationRequestRepository.save({ id, is_verified });
      await Promise.all([
        this.userRepository.update({ id }, { is_identity_verified: true }),
        this.accountVerificationRequestRepository.update({ id }, { is_verified, reviewed_at: new Date() }),
      ]);
    } else {
      await this.accountVerificationRequestRepository.save({ id, is_verified, rejected_info, reviewed_at: new Date() });
    }
  }

  public async createRequest(
    user_id: string,
    data: Partial<AccountVerificationRequest>,
  ): Promise<AccountVerificationRequest> {
    delete data.is_verified;
    delete data.reviewed_at;
    delete data.rejected_info;
    delete data.request_date;
    const checkExsist = await this.accountVerificationRequestRepository
      .createQueryBuilder()
      .where({ user_id, is_verified: true })
      .getOne();
    if (checkExsist) {
      throw new AppError('User already verified', 400);
    }
    return await this.accountVerificationRequestRepository.save({ user_id, ...data });
  }
}

export default AccountVerificationRequestService;
