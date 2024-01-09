import { Service } from 'typedi';
import CommonServices from './common.service';
import { AccountVerificationRequest } from '~/domain/databases/entity/AccountVerificationRequest';
import { DataSource, Repository } from 'typeorm';
import { BaseQuery } from '~/models/PostQuery';
import AppConfig from '~/constants/configs';
import { AppError } from '~/models/Error';
import { User } from '~/domain/databases/entity/User';
import ServerCodes from '~/constants/server_codes';
import { NotificationService } from './nofitication.service';
import { NotificationType } from '~/constants/enum';
import e from 'express';
@Service()
class AccountVerificationRequestService extends CommonServices {
  private accountVerificationRequestRepository: Repository<AccountVerificationRequest>;
  private userRepository: Repository<User>;
  private notificationService: NotificationService;
  constructor(dataSource: DataSource, notificationService: NotificationService) {
    super(AccountVerificationRequest, dataSource);
    this.accountVerificationRequestRepository = this.repository as Repository<AccountVerificationRequest>;
    this.notificationService = notificationService;
    this.userRepository = dataSource.getRepository(User);
  }

  public async getAllByQuery(query: BaseQuery): Promise<{ num_of_pages: number; data: AccountVerificationRequest[] }> {
    let { page } = query;
    const { wheres, orders } = query;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
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
      num_of_pages: Math.ceil(res[1] / AppConfig.ResultPerPage),
      data: res[0],
    };
  }

  public async updateRequest(id: string, is_verified: boolean, rejected_info: string | null): Promise<void> {
    if (!is_verified && rejected_info?.length === 0) {
      throw AppError.badRequest(ServerCodes.CommomCode.MissingRequiredFields, 'rejected_info must not be empty');
    }

    if (is_verified && rejected_info) {
      // throw new AppError('rejected_info must be null when is_verified is true', 400);
      throw AppError.badRequest(
        ServerCodes.CommomCode.MissingRequiredFields,
        'rejected_info must be null when is_verified is true',
      );
    }
    const request = await this.accountVerificationRequestRepository
      .createQueryBuilder()
      .where({ id })
      .andWhere('is_verified IS NULL')
      .andWhere('reviewed_at IS NULL')
      .getOne();

    if (!request) {
      throw AppError.notFound({
        message: 'Account verification request not found',
      });
    }

    if (request.is_verified !== null) {
      throw AppError.badRequest(ServerCodes.CommomCode.BadRequest, 'Account verification request already reviewed');
    }

    if (is_verified) {
      await Promise.all([
        this.userRepository.update({ id: request.user_id }, { is_identity_verified: true }),
        this.accountVerificationRequestRepository.update({ id }, { is_verified, reviewed_at: new Date() }),
      ]);
      this.createNotification(request.user_id, is_verified, rejected_info)
        .then(() => {})
        .catch((err) => console.log(err));
    } else {
      // await this.accountVerificationRequestRepository.save({
      //   id: request.user_id,
      //   is_verified,
      //   rejected_info,
      //   reviewed_at: new Date(),
      // });
      await this.accountVerificationRequestRepository.update(
        { id },
        { is_verified, rejected_info, reviewed_at: new Date() },
      );
      this.createNotification(request.user_id, is_verified, rejected_info)
        .then(() => {})
        .catch((err) => console.log(err));
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
      .where({ user_id })
      .orderBy('request_date', 'DESC')
      .getOne();
    if (checkExsist !== null && checkExsist.is_verified === true) {
      throw AppError.badRequest(ServerCodes.UserCode.UserAlreadyVerified, 'User already verified');
    } else if (checkExsist !== null && checkExsist.is_verified === null) {
      throw AppError.badRequest(ServerCodes.UserCode.UserAlreadySentRequest, 'User already sent request');
    }
    return await this.accountVerificationRequestRepository.save({ user_id, ...data });
  }

  // Get lastest request of user by user_id
  public async getLastestRequest(
    user_id: string,
  ): Promise<{ status: 'not_sent' | 'pending' | 'verified' | 'rejected'; rejected_info?: string | null }> {
    const res = await this.accountVerificationRequestRepository
      .createQueryBuilder()
      .where({ user_id })
      .orderBy('request_date', 'DESC')
      .getOne();
    if (res === null) {
      return {
        status: 'not_sent',
      };
    } else if (res.is_verified === null) {
      return {
        status: 'pending',
      };
    } else if (res.is_verified === true) {
      return {
        status: 'verified',
      };
    } else {
      return {
        status: 'rejected',
        rejected_info: res.rejected_info,
      };
    }
  }

  private async createNotification(user_id: string, is_verified: boolean, rejected_info: string | null) {
    await this.notificationService.createNotification({
      type: is_verified
        ? NotificationType.accept_account_verification_request
        : NotificationType.reject_account_verification_request,
      headings: {
        en: is_verified
          ? 'Your account verification request has been accepted'
          : 'Your account verification request has been rejected',
        vi: is_verified
          ? 'Yêu cầu xác thực tài khoản của bạn đã được chấp nhận'
          : 'Yêu cầu xác thực tài khoản của bạn đã bị từ chối',
      },
      content: {
        en: is_verified
          ? 'Your account verification request has been accepted. You can see your verified status in your profile'
          : 'Your account verification request has been rejected. Reason: ' + rejected_info,
        vi: is_verified
          ? 'Yêu cầu xác thực tài khoản của bạn đã được chấp nhận. Bạn có thể xem trạng thái xác thực của mình trong trang cá nhân'
          : 'Yêu cầu xác thực tài khoản của bạn đã bị từ chối. Lý do: ' + rejected_info,
      },
      data: undefined,
      include_external_user_ids: [user_id],
    });
  }
}

export default AccountVerificationRequestService;
