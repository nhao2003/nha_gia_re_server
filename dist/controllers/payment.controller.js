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
const typedi_1 = require("typedi");
const payment_service_1 = __importDefault(require("../services/payment.service"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
let PaymentController = class PaymentController {
    paymentServices;
    constructor(paymentServices) {
        this.paymentServices = paymentServices;
    }
    createOrderMemberShipPayment = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { user_id, membership_package_id, num_of_subscription_month, discount_code } = req.body;
        if (!user_id || !membership_package_id || !num_of_subscription_month) {
            res.status(400).json({
                status: 'fail',
                message: 'Missing required fields',
                code: 400,
            });
        }
        const result = await this.paymentServices.subscribePackage({
            user_id,
            package_id: membership_package_id,
            num_of_subscription_month,
            discount_code,
        });
        const appRessponse = {
            status: 'success',
            code: 200,
            message: 'Create order successfully',
            result,
        };
        res.status(200).json(appRessponse);
    });
    verifyZaloPayTransaction = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { type, mac, data } = req.body;
        console.log('type', type);
        console.log('mac', mac);
        console.log('data', data);
        const result = await this.paymentServices.verifySuccessZaloPayTransaction({ type, mac, data });
        console.log('result', result);
        if (result.return_code === 1 || result.return_code === 2) {
            return res.status(200).json(result);
        }
        res.status(500).json({
            return_code: 0,
            return_message: 'exception',
        });
    });
    createMiniAppOrder = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const user_id = req.body.user_id;
        const package_id = req.body.package_id;
        const num_of_subscription_month = req.body.num_of_subscription_month;
        const discount_code = req.body.discount_code;
        if (!user_id || !package_id || !num_of_subscription_month) {
            res.status(400).json({
                status: 'fail',
                message: 'Missing required fields',
            });
        }
        const result = await this.paymentServices.subscribePackageByMiniApp({
            user_id,
            package_id,
            num_of_subscription_month,
            discount_code,
        });
        const appRessponse = {
            status: 'success',
            code: 200,
            message: 'Create order successfully',
            result,
        };
        res.status(200).json(appRessponse);
    });
    updatePaymentStatus = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const order_id = req.body.order_id;
        const transaction_id = req.body.transaction_id;
        const result = await this.paymentServices.miniAppUpdateTransaction(transaction_id, order_id);
        const appRessponse = {
            status: 'success',
            code: 200,
            message: 'Update transaction successfully',
            result,
        };
        res.status(200).json(appRessponse);
    });
    verifyMiniAppTransaction = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { data, mac } = req.body;
        if (!data || !mac) {
            res.status(400).json({
                status: 'fail',
                message: 'Missing required fields',
            });
        }
        const result = await this.paymentServices.verifyMiniAppTransaction(data, mac);
        res.status(200).json(result);
    });
    getTransaction = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const id = req.query.id;
        if (!id) {
            res.status(400).json({
                status: 'fail',
                message: 'Missing required fields',
            });
        }
        const result = await this.paymentServices.getTransaction(id);
        const appRessponse = {
            status: 'success',
            code: 200,
            message: 'Get transaction successfully',
            result,
        };
        res.status(200).json(appRessponse);
    });
};
PaymentController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [payment_service_1.default])
], PaymentController);
exports.default = PaymentController;
