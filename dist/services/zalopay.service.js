"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../constants/configs"));
const crypto_1 = __importDefault(require("crypto"));
class ZaloPayServices {
    generateTransactionId(date) {
        const year = date.getFullYear().toString().slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        let prefix = `${year}${month}${day}_`;
        while (prefix.length < 20) {
            prefix += Math.floor(Math.random() * 10);
        }
        if (prefix.length > 40) {
            throw new Error('Transaction id is too long');
        }
        return prefix;
    }
    createOrderMac(order) {
        const data = configs_1.default.ZALOPAY_SANDBOX.app_id +
            '|' +
            (order.app_trans_id || this.generateTransactionId(order.app_time)) +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time.getTime() +
            '|' +
            JSON.stringify(order.embed_data) +
            '|' +
            JSON.stringify(order.item);
        const hmac = crypto_1.default
            .createHmac('sha256', configs_1.default.ZALOPAY_SANDBOX.key1)
            .update(data)
            .digest('hex');
        return hmac;
    }
    async createOrder(orderRequest) {
        orderRequest.app_trans_id = orderRequest.app_trans_id || this.generateTransactionId(orderRequest.app_time);
        const body = {
            app_id: Number(configs_1.default.ZALOPAY_SANDBOX.app_id),
            mac: this.createOrderMac(orderRequest),
            app_trans_id: orderRequest.app_trans_id,
            app_user: orderRequest.app_user,
            app_time: orderRequest.app_time.getTime(),
            item: JSON.stringify(orderRequest.item),
            embed_data: JSON.stringify(orderRequest.embed_data),
            amount: orderRequest.amount,
            description: orderRequest.description,
            bank_code: orderRequest.bank_code,
            callback_url: orderRequest.callback_url,
            phone: orderRequest.phone,
            email: orderRequest.email,
        };
        const response = await fetch(configs_1.default.ZALOPAY_API, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        return {
            ...json,
            app_trans_id: orderRequest.app_trans_id,
        };
    }
    verifyOrderMac(mac, callbackData) {
        return (crypto_1.default
            .createHmac('sha256', configs_1.default.ZALOPAY_SANDBOX.key2)
            .update(callbackData)
            .digest('hex') === mac);
    }
    verifyMiniAppOrderMac(data, mac) {
        // const data =
        //   'appId={appId}&amount={amount}&description={description}&orderId={orderId}&message={message}&resultCode={resultCode}&transId={transId}';
        const callbackData = `appId=${data.appId}&amount=${data.amount}&description=${data.description}&orderId=${data.orderId}&message=${data.message}&resultCode=${data.resultCode}&transId=${data.transId}`;
        const hmac = crypto_1.default
            .createHmac('sha256', configs_1.default.ZALOPAY_SANDBOX.privateKey)
            .update(callbackData)
            .digest('hex');
        return hmac === mac;
    }
}
exports.default = ZaloPayServices;
