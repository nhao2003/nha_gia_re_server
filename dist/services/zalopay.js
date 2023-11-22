"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../constants/configs"));
const crypto_1 = __importDefault(require("crypto"));
class ZaloPayServices {
    app_id;
    key1;
    secretKey;
    sandboxUrl;
    constructor() {
        // Khai báo các thông tin cấu hình cho ZaloPay
        this.app_id = Number(configs_1.default.ZALOPAY_SANDBOX.app_id); // Thay thế bằng app_id của bạn
        this.key1 = configs_1.default.ZALOPAY_SANDBOX.key1; // Thay thế bằng key1 của bạn
        this.secretKey = configs_1.default.ZALOPAY_SANDBOX.key2; // Thay thế bằng secretKey của bạn
        this.sandboxUrl = 'https://sb-openapi.zalopay.vn/v2/create'; // URL của môi trường Sandbox
    }
    // Hàm tạo mã giao dịch (app_trans_id)
    generateAppTransId() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        var prefix = `${year}${month}${day}_`;
        while (prefix.length < 20) {
            prefix += Math.floor(Math.random() * 10);
        }
        if (prefix.length > 40) {
            throw new Error('Transaction id is too long');
        }
        return prefix;
    }
    // Hàm tạo thông tin chứng thực (mac)
    generateMac(order) {
        const data = configs_1.default.ZALOPAY_SANDBOX.app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;
        console.log("A0: ", data);
        console.log("A2: ", this.key1);
        const mac = crypto_1.default
            .createHmac('sha256', this.key1)
            .update(data)
            .digest('hex');
        return mac;
    }
    async createOrder2() {
        const config = {
            app_id: configs_1.default.ZALOPAY_SANDBOX.app_id,
            key1: configs_1.default.ZALOPAY_SANDBOX.key1,
            key2: configs_1.default.ZALOPAY_SANDBOX.key2,
            endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
            bankcode: 'zalopayapp',
            callbackurl: 'https://ldgecfuqlicdeuqijmbr.supabase.co/functions/v1/callback-order',
        };
        const order = {
            app_id: config.app_id,
            app_trans_id: this.generateAppTransId(),
            app_user: 'nhao123',
            app_time: Date.now().toString(),
            item: JSON.stringify([{}]),
            embed_data: JSON.stringify([{}]),
            amount: 50000,
            description: '',
            mac: '',
        };
        try {
            order.description = 'Nhà giá rẻ - Thanh toán gói';
            const data = config.app_id +
                '|' +
                order.app_trans_id +
                '|' +
                order.app_user +
                '|' +
                order.amount +
                '|' +
                order.app_time +
                '|' +
                order.embed_data +
                '|' +
                order.item;
            const orderMac = {
                app_trans_id: order.app_trans_id,
                app_user: order.app_user,
                app_time: order.app_time,
                item: order.item,
                embed_data: order.embed_data,
                amount: order.amount,
            };
            order.mac = this.generateMac(orderMac);
            const params = new URLSearchParams();
            params.set('appid', order.app_id);
            params.set('apptransid', order.app_trans_id);
            params.set('appuser', order.app_user);
            params.set('apptime', order.app_time.toString());
            params.set('item', JSON.stringify([{}]));
            params.set('embeddata', JSON.stringify([{}]));
            params.set('amount', order.amount.toString());
            params.set('description', order.description);
            params.set('mac', order.mac);
            params.set('bankcode', config.bankcode);
            params.set('callbackurl', config.callbackurl);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            };
            const res = await fetch(config.endpoint, requestOptions);
            const result = await res.json();
            console.log(result);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
}
// Test
const zaloPayServices = new ZaloPayServices();
zaloPayServices
    .createOrder2()
    .then(() => {
    console.log('Done');
})
    .catch((error) => {
    console.log(error);
});
