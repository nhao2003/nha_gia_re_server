import { Repository } from 'typeorm';
import { MoreThanOrEqual } from 'typeorm';
import MembershipPackage from '~/domain/databases/entity/MembershipPackage';
import Subscription from '~/domain/databases/entity/Subscription ';
import { User } from '~/domain/databases/entity/User';
import Transaction from '~/domain/databases/entity/Transaction';
import DiscountCode from '~/domain/databases/entity/DiscountCode';
import { AppError } from '~/models/Error';
import zalopayServices from './zalopay.services';
import ZaloPayOrderResponse from '~/models/Response/ZaloPayOrderResponse';
import AppConfig from '../constants/configs';
type OrderMembershipPackageRequest = {
  user_id: string;
  package_id: string;
  discount_id?: string | null;
  num_of_subscription_month: number;
  app_trans_id: string;
  timestamp: Date;
  amount: number;
};

type OrderMembershipPackageResponse = {
  order_url: string;
  zp_trans_token: string;
  order_token: string;
  qr_code: string;
  app_trans_id: string;
  transaction_id: string;
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

type CreateSubscription = {
  user_id: string;
  package_id: string;
  starting_date: Date;
  expiration_date: Date;
  transaction_id?: string | null;
};

class PaymentServices {
  private subcritpionRepository: Repository<Subscription>;
  private userRepository: Repository<User>;
  private membershipPackageRepository: Repository<MembershipPackage>;
  private transactionRepository: Repository<Transaction>;
  private discountCodeRepository: Repository<DiscountCode>;

  constructor() {
    this.subcritpionRepository = Subscription.getRepository();
    this.userRepository = User.getRepository();
    this.membershipPackageRepository = MembershipPackage.getRepository();
    this.transactionRepository = Transaction.getRepository();
    this.discountCodeRepository = DiscountCode.getRepository();
  }

  public async checkUserHasSubscription(user_id: string): Promise<Subscription | null> {
    const res = this.subcritpionRepository.findOne({
      where: { user_id, expiration_date: MoreThanOrEqual(new Date()), is_active: true },
    });
    return res;
  }
  //TODO: create subscription
  private async createSubscription(create: CreateSubscription): Promise<String> {
    const res = await this.subcritpionRepository.insert({
      user_id: create.user_id,
      package_id: create.package_id,
      starting_date: create.starting_date.toISOString(),
      expiration_date: create.expiration_date.toISOString(),
      transaction_id: create.transaction_id,
      is_active: true,
    });
    return res.identifiers[0].id;
  }
  private async createTransaction(orderRequest: OrderMembershipPackageRequest): Promise<string> {
    const data = {
      ...orderRequest,
      status: 'pending',
    };
    const res = await this.transactionRepository.insert(data);
    return res.identifiers[0].id;
  }

  public subscribePackage = async (orderRequest: {
    user_id: string;
    package_id: string;
    num_of_subscription_month: number;
    discount_code?: string | null;
  }): Promise<OrderMembershipPackageResponse> => {
    const checkUserHasSubscription = await this.checkUserHasSubscription(orderRequest.user_id);
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
    const amount = membershipPackage.price_per_month * num_of_subscription_month;
    const discount_percent = discount ? discount.discount_percent : 0;
    const discount_amount = amount * discount_percent;
    const total_amount = amount - discount_amount;
    const starting_date = new Date();
    const zalopayResponse: ZaloPayOrderResponse = await zalopayServices.createOrder({
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
      callback_url: AppConfig.APP_URL + '/api/v1/payment/verify-zalopay-transaction',
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
    const transaction_id = await this.createTransaction(create);
    return {
      transaction_id,
      order_url: zalopayResponse.order_url,
      zp_trans_token: zalopayResponse.zp_trans_token,
      order_token: zalopayResponse.order_token,
      qr_code: zalopayResponse.qr_code,
      app_trans_id: zalopayResponse.app_trans_id,
    };
  };

  public async checkTransaction(transaction_id: string): Promise<Transaction | null> {
    const res = await this.transactionRepository.findOne({ where: { id: transaction_id, is_active: true } });
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

    if (!zalopayServices.verifyOrderMac(zaloPayResponse.mac, zaloPayResponse.data)) {
      console.log('Invalid mac');
      return {
        return_code: 3,
        return_message: 'Invalid mac',
      };
    }
    const transaction = await this.transactionRepository.findOne({
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
    if (transaction !== null && transaction.status === 'success') {
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
    const date: Date = new Date(data.server_time);
    const starting_date = date;
    const expiration_date = new Date(date.setMonth(date.getMonth() + transaction.num_of_subscription_month));
    console.log(starting_date);
    await this.createSubscription({
      user_id: (data as ZaloPayCallbackResponse).app_user,
      package_id: transaction.package_id,
      starting_date: starting_date,
      expiration_date: expiration_date,
      transaction_id: transaction.id,
    });
    await this.transactionRepository.update({ id: transaction.id }, { status: 'success' });
    return {
      return_code: 1,
      return_message: 'Success',
    };
  }
}
export default new PaymentServices();
