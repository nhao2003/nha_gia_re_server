import AppConfig from '../constants/configs';
import crypto from 'crypto';
type Order = {
  app_trans_id: string;
  app_user: string;
  app_time: string;
  item: string;
  embed_data: string;
  amount: number;
};
class ZaloPayServices {
  private app_id: number;
  private key1: string;
  private secretKey: string;
  private sandboxUrl: string;

  constructor() {
    // Khai báo các thông tin cấu hình cho ZaloPay
    this.app_id = Number(AppConfig.ZALOPAY_SANDBOX.app_id); // Thay thế bằng app_id của bạn
    this.key1 = AppConfig.ZALOPAY_SANDBOX.key1 as string; // Thay thế bằng key1 của bạn
    this.secretKey = AppConfig.ZALOPAY_SANDBOX.key2 as string; // Thay thế bằng secretKey của bạn
    this.sandboxUrl = 'https://sb-openapi.zalopay.vn/v2/create'; // URL của môi trường Sandbox
  }

  // Hàm tạo mã giao dịch (app_trans_id)
  generateAppTransId() {
    const date = new Date();
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

  // Hàm tạo thông tin chứng thực (mac)
  generateMac(order: Order) {
    const data =
      (AppConfig.ZALOPAY_SANDBOX.app_id as string) +
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
    console.log('A0: ', data);
    console.log('A2: ', this.key1);
    const mac = crypto.createHmac('sha256', this.key1).update(data).digest('hex');
    return mac;
  }

  async createOrder2() {
    const config = {
      app_id: AppConfig.ZALOPAY_SANDBOX.app_id as string,
      key1: AppConfig.ZALOPAY_SANDBOX.key1 as string,
      key2: AppConfig.ZALOPAY_SANDBOX.key2 as string,
      endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
      bankcode: 'zalopayapp',
      callbackurl: 'https://ldgecfuqlicdeuqijmbr.supabase.co/functions/v1/callback-order',
    };
    const order = {
      app_id: config.app_id,
      app_trans_id: this.generateAppTransId(), // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'nhao123',
      app_time: Date.now().toString(), // miliseconds
      item: JSON.stringify([{}]),
      embed_data: JSON.stringify([{}]),
      amount: 50000,
      description: '',
      mac: '',
    };
    try {
      order.description = 'Nhà giá rẻ - Thanh toán gói';
      const orderMac: Order = {
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
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      };
      const res = await fetch(config.endpoint, requestOptions);
      const result = await res.json();
      console.log(result);
      return result;
    } catch (error) {
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
