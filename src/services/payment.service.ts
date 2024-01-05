import { DataSource, Repository } from 'typeorm';
import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import Subscription from '~/domain/databases/entity/Subscription ';
import { User } from '~/domain/databases/entity/User';
import Transaction from '~/domain/databases/entity/Transaction';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import { AppError } from '~/models/Error';
import ZaloPayOrderResponse from '~/models/Response/ZaloPayOrderResponse';
import AppConfig from '../constants/configs';
import SubscriptionServices from './subscription.service';
import MiniAppTransactionDataCallback from '~/models/Response/MiniAppTransactionDataCallback';
import { Service } from 'typedi';
import ZaloPayServices from './zalopay.service';
import CommonServices from './common.service';
import { BaseQuery } from '~/models/PostQuery';
import { TransactionStatus } from '~/constants/enum';
import { TransactionService } from './transaction.service';

type OrderMembershipPackageRequest = {
  user_id: string;
  package_id: string;
  discount_id?: string | null;
  num_of_subscription_month: number;
  app_trans_id?: string | null;
  timestamp: Date;
  amount: number;
  platform?: string;
};

type OrderMembershipPackageResponse = {
  order_url: string;
  zp_trans_token: string;
  order_token: string;
  qr_code: string;
  app_trans_id?: string | null;
  transaction: string;
};
type OrderMembershipPackagMiniAppeResponse = {
  amount: number;
  desc: string;
  extradata: string;
  transaction_id: string;
  item: MembershipPackage[];
};
type ZaloPayCallbackResponse = {
  app_id: number; // app_id của đơn hàng
  app_trans_id: string; // app_trans_id của đơn hàng
  app_time: number; // app_time của đơn hàng
  app_user: string; // app_user của đơn hàng
  amount: number; // Số tiền ứng dụng nhận được
  embed_data: string; // embed_data của đơn hàng
  item: string; // item của đơn hàng
  zp_trans_id: number; // Mã giao dịch của ZaloPay
  server_time: number; // Thời gian giao dịch của ZaloPay (unix timestamp in miliseconds)
  channel: number; // Kênh thanh toán
  merchant_user_id: string; // ZaloPay user đã thanh toán cho đơn hàng
  user_fee_amount: number; // Số tiền phí
  discount_amount: number; // Số tiền giảm giá
};

@Service()
class PaymentServices {
  private subcritpionRepository: Repository<Subscription>;
  private userRepository: Repository<User>;
  private membershipPackageRepository: Repository<MembershipPackage>;
  private transactionService: TransactionService;
  private discountCodeRepository: Repository<DiscountCode>;
  private zalopayServices: ZaloPayServices;
  private subscriptionServices: SubscriptionServices;
  constructor(dataSource: DataSource, zalopayServices: ZaloPayServices) {
    this.subcritpionRepository = dataSource.getRepository(Subscription);
    this.userRepository = dataSource.getRepository(User);
    this.membershipPackageRepository = dataSource.getRepository(MembershipPackage);
    this.transactionService = new TransactionService(dataSource);
    this.discountCodeRepository = dataSource.getRepository(DiscountCode);
    this.zalopayServices = zalopayServices;
    this.subscriptionServices = new SubscriptionServices(dataSource);
  }

  //TODO: create subscription

  private async createTransaction(
    orderRequest: OrderMembershipPackageRequest,
    status: string = TransactionStatus.unpaid,
  ): Promise<string> {
    const data = {
      ...orderRequest,
      status,
    };
    const res = await this.transactionService.create(data);
    return res;
  }

  public subscribePackage = async (orderRequest: {
    user_id: string;
    package_id: string;
    num_of_subscription_month: number;
    discount_code?: string | null;
  }): Promise<OrderMembershipPackageResponse> => {
    const checkUserHasSubscription = await this.subscriptionServices.checkUserHasSubscription(orderRequest.user_id);
    if (checkUserHasSubscription) {
      throw new AppError('User has subscription', 400);
    }
    const { user_id, package_id, discount_code, num_of_subscription_month } = orderRequest;
    let discount = null;
    if (discount_code) {
      discount = await this.discountCodeRepository.findOne({ where: { code: discount_code } });
      if (!discount) {
        throw new AppError('Discount code not found', 404);
      }
    }
    const membershipPackage = await this.membershipPackageRepository.findOne({ where: { id: package_id } });
    if (!membershipPackage) {
      throw new AppError('Membership package not found', 404);
    }
    const amount = membershipPackage.price_per_month * num_of_subscription_month;
    // const discount_percent = discount ? discount.discount_percent : 0;
    let discount_percent = 0;
    if(discount?.min_subscription_months && discount?.min_subscription_months <= num_of_subscription_month){
      discount_percent = discount.discount_percent;
    }
    const discount_amount = amount * discount_percent;
    const total_amount = amount - discount_amount;
    const starting_date = new Date();
    const zalopayResponse: ZaloPayOrderResponse = await this.zalopayServices.createOrder({
      app_user: user_id,
      amount: total_amount,
      item: [membershipPackage],
      description: `Mua ${membershipPackage.name} thời hạn ${num_of_subscription_month} tháng`,
      embed_data: {
        package_id,
        user_id,
      },
      bank_code: 'zalopayapp',
      app_time: starting_date,
      //TODO: change callback_url
      callback_url: AppConfig.APP_URL + '/api/v1/membership-package/verify-zalopay-transaction',
    });

    if (zalopayResponse.return_code !== 1) {
      throw new AppError('Đã có lỗi xảy ra, vui lòng thử lại sau', 500);
    }
    const create: OrderMembershipPackageRequest = {
      amount: total_amount,
      num_of_subscription_month,
      user_id,
      package_id,
      app_trans_id: zalopayResponse.app_trans_id,
      timestamp: starting_date,
    };
    const transaction = await this.createTransaction(create);
    return {
      transaction,
      order_url: zalopayResponse.order_url,
      zp_trans_token: zalopayResponse.zp_trans_token,
      order_token: zalopayResponse.order_token,
      qr_code: zalopayResponse.qr_code,
      app_trans_id: zalopayResponse.app_trans_id,
    };
  };

  // 1. Mini app call this function to create order
  // 2. Server create transaction
  // 3. Server return order_info to mini app
  // 4. Mini app call ZaloPay API to create order
  // 5. Mini app Update transaction status to pending
  // 6. Mini app Update app_trans_id to transaction
  // 7. User pay order
  // 8. ZaloPay call callback_url
  // 9. Server verify transaction
  // 10. Server create subscription if transaction is valid
  public subscribePackageByMiniApp = async (orderRequest: {
    user_id: string;
    package_id: string;
    num_of_subscription_month: number;
    discount_code?: string | null;
  }): Promise<OrderMembershipPackagMiniAppeResponse> => {
    const checkUserHasSubscription = await this.subscriptionServices.checkUserHasSubscription(orderRequest.user_id);
    if (checkUserHasSubscription) {
      throw new AppError('User has subscription', 400);
    }
    const { user_id, package_id, discount_code: discount_id, num_of_subscription_month } = orderRequest;
    let discount = null;
    if (discount_id) {
      discount = await this.discountCodeRepository.findOne({ where: { code: discount_id } });
      if (!discount) {
        throw new AppError('Discount code not found', 404);
      }
    }
    const membershipPackage = await this.membershipPackageRepository.findOne({ where: { id: package_id } });
    if (!membershipPackage) {
      throw new AppError('Membership package not found', 404);
    }
    const amount = Number(membershipPackage.price_per_month) * num_of_subscription_month;
    const discount_percent = discount ? discount.discount_percent : 0;
    const discount_amount = amount * discount_percent;
    const total_amount = amount - discount_amount;
    const starting_date = new Date();
    const transaction_id = await this.createTransaction(
      {
        amount: total_amount,
        num_of_subscription_month,
        user_id,
        package_id,
        app_trans_id: null,
        timestamp: starting_date,
        platform: 'mini-app',
      },
      'initiated',
    );
    const res = {
      amount: total_amount,
      desc: `Mua ${membershipPackage.name} thời hạn ${num_of_subscription_month} tháng`,
      extradata: user_id,
      transaction_id,
      item: [membershipPackage],
    };
    return res;
  };

  //Update app_status_id to transaction
  public async miniAppUpdateTransaction(transaction_id: string, order_id: string) {
    await this.transactionService.update;
    await this.transactionService.getRepository().update(
      {
        id: transaction_id,
      },
      {
        app_trans_id: order_id,
        status: TransactionStatus.unpaid,
      },
    );
  }

  public verifyMiniAppTransaction = async (data: MiniAppTransactionDataCallback, mac: string): Promise<any> => {
    if (!this.zalopayServices.verifyMiniAppOrderMac(data, mac)) {
      console.log('Invalid mac');
      return {
        returnCode: 3,
        returnMessage: 'Invalid mac',
      };
    }
    console.log(data);
    const transaction = await this.transactionService.getRepository().findOne({
      where: {
        app_trans_id: data.orderId,
      },
    });
    if (!transaction) {
      return {
        returnCode: 3,
        returnMessage: 'Transaction not found',
      };
    }
    if (transaction.status === TransactionStatus.paid) {
      return {
        returnCode: 2,
        returnMessage: 'Trùng mã giao dịch transId',
      };
    }
    transaction.status = TransactionStatus.paid;
    const user_id = JSON.parse(decodeURIComponent(data.extradata));
    const date = new Date(data.transTime);
    const starting_date = date;
    const expiration_date = new Date(date.setMonth(date.getMonth() + transaction.num_of_subscription_month));
    const create = await this.subscriptionServices.createSubscription({
      user_id,
      package_id: transaction.package_id,
      starting_date,
      expiration_date,
      transaction_id: transaction.id,
    });
    await Promise.all([create, this.transactionService.getRepository().save(transaction)]);
    return {
      return_code: 1,
      return_message: TransactionStatus.paid,
    };
  };

  public async checkTransaction(transaction_id: string): Promise<Transaction | null> {
    const res = await this.transactionService
      .getRepository()
      .findOne({ where: { id: transaction_id, is_active: true } });
    if (!res) {
      throw new AppError('Transaction not found', 404);
    }
    return res;
  }

  public async verifySuccessZaloPayTransaction(zaloPayResponse: {
    type: number;
    mac: string;
    data: string;
  }): Promise<any> {
    const data = JSON.parse(zaloPayResponse.data);

    if (!this.zalopayServices.verifyOrderMac(zaloPayResponse.mac, zaloPayResponse.data)) {
      console.log('Invalid mac');
      return {
        return_code: 3,
        return_message: 'Invalid mac',
      };
    }
    const transaction = await this.transactionService.getRepository().findOne({
      where: {
        app_trans_id: (data as ZaloPayCallbackResponse).app_trans_id,
      },
    });
    if (!transaction) {
      console.log('Transaction not found');
      return {
        return_code: 3,
        return_message: 'Transaction not found',
      };
    }
    if (transaction !== null && transaction.status === TransactionStatus.paid) {
      console.log('app_trans_id has been received');
      return {
        return_code: 2,
        return_message: 'app_trans_id has been received',
      };
    }
    const subscription = await this.subcritpionRepository.findOne({
      where: {
        user_id: (data as ZaloPayCallbackResponse).app_user,
        is_active: true,
      },
    });

    if (subscription) {
      console.log('User has subscription');
      return {
        return_code: 3,
        return_message: 'User has subscription',
      };
    }
    const starting_date = new Date(data.server_time);
    const expiration_date = new Date(data.server_time);
    expiration_date.setMonth(expiration_date.getMonth() + transaction.num_of_subscription_month);
    console.log(starting_date);
    await this.subscriptionServices.createSubscription({
      user_id: (data as ZaloPayCallbackResponse).app_user,
      package_id: transaction.package_id,
      starting_date: starting_date,
      expiration_date: expiration_date,
      transaction_id: transaction.id,
    });
    await this.transactionService.getRepository().update({ id: transaction.id }, { status: TransactionStatus.paid });
    return {
      return_code: 1,
      return_message: TransactionStatus.paid,
    };
  }

  public async getTransaction(id: string): Promise<Transaction | null> {
    const res = await this.transactionService
      .getRepository()
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.subscription', 'subscription')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('transaction.is_active = true')
      .andWhere('app_trans_id = :app_trans_id', { app_trans_id: id })
      .getOne();
    if (!res) {
      throw new AppError('Transaction not found', 404);
    }
    return res;
  }

  public async getAllTransactionByQuery(query: Record<string, any>) {
    const buildQuery = this.transactionService.buildBaseQuery(query);
    return await this.transactionService.getAllByQuery(buildQuery);
  }

  public async getAllTransactionByUser(
    user_id: string,
    query: Record<string, any>,
  ): Promise<{
    num_of_pages: number;
    data: Transaction[];
  }> {
    query.user_id = {
      eq: `'${user_id}'`,
    };
    const buildQuery = this.transactionService.buildBaseQuery(query);
    const res = await this.transactionService.getAllByQuery(buildQuery);
    return res;
  }
}
export default PaymentServices;
