"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const MembershipPackage_1 = __importDefault(require("../domain/databases/entity/MembershipPackage"));
const Subscription_1 = __importDefault(require("../domain/databases/entity/Subscription "));
const User_1 = require("../domain/databases/entity/User");
const Transaction_1 = __importDefault(require("../domain/databases/entity/Transaction"));
const DiscountCode_1 = __importDefault(require("../domain/databases/entity/DiscountCode"));
const Error_1 = require("../models/Error");
const configs_1 = __importDefault(require("../constants/configs"));
const subscription_service_1 = __importDefault(require("./subscription.service"));
const typedi_1 = require("typedi");
const zalopay_service_1 = __importDefault(require("./zalopay.service"));
let PaymentServices = class PaymentServices {
    subcritpionRepository;
    userRepository;
    membershipPackageRepository;
    transactionRepository;
    discountCodeRepository;
    zalopayServices;
    subscriptionServices;
    constructor(dataSource, zalopayServices) {
        this.subcritpionRepository = dataSource.getRepository(Subscription_1.default);
        this.userRepository = dataSource.getRepository(User_1.User);
        this.membershipPackageRepository = dataSource.getRepository(MembershipPackage_1.default);
        this.transactionRepository = dataSource.getRepository(Transaction_1.default);
        this.discountCodeRepository = dataSource.getRepository(DiscountCode_1.default);
        this.zalopayServices = zalopayServices;
        this.subscriptionServices = new subscription_service_1.default(dataSource);
    }
    //TODO: create subscription
    async createTransaction(orderRequest, status = 'pending') {
        const data = {
            ...orderRequest,
            status,
        };
        const res = await this.transactionRepository.insert(data);
        return res.identifiers[0].id;
    }
    subscribePackage = async (orderRequest) => {
        const checkUserHasSubscription = await this.subscriptionServices.checkUserHasSubscription(orderRequest.user_id);
        if (checkUserHasSubscription) {
            throw new Error_1.AppError('User has subscription', 400);
        }
        const { user_id, package_id, discount_code: discount_id, num_of_subscription_month } = orderRequest;
        let discount = null;
        if (discount_id) {
            discount = await this.discountCodeRepository.findOne({ where: { code: discount_id } });
            if (!discount) {
                throw new Error_1.AppError('Discount code not found', 404);
            }
        }
        const membershipPackage = await this.membershipPackageRepository.findOne({ where: { id: package_id } });
        if (!membershipPackage) {
            throw new Error_1.AppError('Membership package not found', 404);
        }
        const amount = membershipPackage.price_per_month * num_of_subscription_month;
        const discount_percent = discount ? discount.discount_percent : 0;
        const discount_amount = amount * discount_percent;
        const total_amount = amount - discount_amount;
        const starting_date = new Date();
        const zalopayResponse = await this.zalopayServices.createOrder({
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
            callback_url: configs_1.default.APP_URL + '/api/v1/membership-package/verify-zalopay-transaction',
        });
        if (zalopayResponse.return_code !== 1) {
            throw new Error_1.AppError('Đã có lỗi xảy ra, vui lòng thử lại sau', 500);
        }
        const create = {
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
    subscribePackageByMiniApp = async (orderRequest) => {
        const checkUserHasSubscription = await this.subscriptionServices.checkUserHasSubscription(orderRequest.user_id);
        if (checkUserHasSubscription) {
            throw new Error_1.AppError('User has subscription', 400);
        }
        const { user_id, package_id, discount_code: discount_id, num_of_subscription_month } = orderRequest;
        let discount = null;
        if (discount_id) {
            discount = await this.discountCodeRepository.findOne({ where: { code: discount_id } });
            if (!discount) {
                throw new Error_1.AppError('Discount code not found', 404);
            }
        }
        const membershipPackage = await this.membershipPackageRepository.findOne({ where: { id: package_id } });
        if (!membershipPackage) {
            throw new Error_1.AppError('Membership package not found', 404);
        }
        const amount = Number(membershipPackage.price_per_month) * num_of_subscription_month;
        const discount_percent = discount ? discount.discount_percent : 0;
        const discount_amount = amount * discount_percent;
        const total_amount = amount - discount_amount;
        const starting_date = new Date();
        const transaction_id = await this.createTransaction({
            amount: total_amount,
            num_of_subscription_month,
            user_id,
            package_id,
            app_trans_id: null,
            timestamp: starting_date,
            platform: 'mini-app',
        }, 'initiated');
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
    async miniAppUpdateTransaction(transaction_id, order_id) {
        await this.transactionRepository.update({
            id: transaction_id,
        }, {
            app_trans_id: order_id,
            status: 'pending',
        });
    }
    verifyMiniAppTransaction = async (data, mac) => {
        if (!this.zalopayServices.verifyMiniAppOrderMac(data, mac)) {
            console.log('Invalid mac');
            return {
                returnCode: 3,
                returnMessage: 'Invalid mac',
            };
        }
        console.log(data);
        const transaction = await this.transactionRepository.findOne({
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
        if (transaction.status === 'success') {
            return {
                returnCode: 2,
                returnMessage: 'Trùng mã giao dịch transId',
            };
        }
        transaction.status = 'success';
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
        await Promise.all([create, this.transactionRepository.save(transaction)]);
        return {
            return_code: 1,
            return_message: 'Success',
        };
    };
    async checkTransaction(transaction_id) {
        const res = await this.transactionRepository.findOne({ where: { id: transaction_id, is_active: true } });
        if (!res) {
            throw new Error_1.AppError('Transaction not found', 404);
        }
        return res;
    }
    async verifySuccessZaloPayTransaction(zaloPayResponse) {
        const data = JSON.parse(zaloPayResponse.data);
        if (!this.zalopayServices.verifyOrderMac(zaloPayResponse.mac, zaloPayResponse.data)) {
            console.log('Invalid mac');
            return {
                return_code: 3,
                return_message: 'Invalid mac',
            };
        }
        const transaction = await this.transactionRepository.findOne({
            where: {
                app_trans_id: data.app_trans_id,
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
                user_id: data.app_user,
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
            user_id: data.app_user,
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
    async getTransaction(id) {
        const res = await this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.subscription', 'subscription')
            .leftJoinAndSelect('transaction.user', 'user')
            .where('transaction.is_active = true')
            .andWhere('app_trans_id = :app_trans_id', { app_trans_id: id })
            .getOne();
        if (!res) {
            throw new Error_1.AppError('Transaction not found', 404);
        }
        return res;
    }
};
PaymentServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource, zalopay_service_1.default])
], PaymentServices);
exports.default = PaymentServices;
