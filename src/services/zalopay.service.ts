import ZaloPayOrderRequest from '~/models/Request/ZaloPayOrderRequest';
import AppConfig from '../constants/configs';
import crypto from 'crypto';
import ZaloPayOrderResponse from '~/models/Response/ZaloPayOrderResponse';
import ZaloPayCallbackResponse from '~/models/Response/ZaloPayCallbackResponse';
import MiniAppTransactionDataCallback from '~/models/Response/MiniAppTransactionDataCallback';
interface BodyCreateOrderRequest {
  app_id: number;
  mac: string;
  app_user: string;
  amount: number;
  item: string;
  description: string;
  embed_data: string;
  bank_code: string | 'zalopayapp';
  app_trans_id: string;
  app_time: number;
  callback_url?: string | null;
  phone?: string | null;
  email?: string | null;
}

class ZaloPayServices {
  public generateTransactionId(date: Date): string {
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
  private createOrderMac(order: ZaloPayOrderRequest) {
    const data =
      AppConfig.ZALOPAY_SANDBOX.app_id +
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
    const hmac = crypto
      .createHmac('sha256', AppConfig.ZALOPAY_SANDBOX.key1 as string)
      .update(data)
      .digest('hex');
    return hmac;
  }

  public async createOrder(orderRequest: ZaloPayOrderRequest): Promise<ZaloPayOrderResponse> {
    orderRequest.app_trans_id = orderRequest.app_trans_id || this.generateTransactionId(orderRequest.app_time);
    const body: BodyCreateOrderRequest = {
      app_id: Number(AppConfig.ZALOPAY_SANDBOX.app_id),
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

    const response = await fetch(AppConfig.ZALOPAY_API as string, {
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
  public verifyOrderMac(mac: string, callbackData: string): boolean {
    return (
      crypto
        .createHmac('sha256', AppConfig.ZALOPAY_SANDBOX.key2 as string)
        .update(callbackData)
        .digest('hex') === mac
    );
  }
  public verifyMiniAppOrderMac(data: MiniAppTransactionDataCallback, mac: string): boolean {
    const callbackData = `appId=${data.appId}&amount=${data.amount}&description=${data.description}&orderId=${data.orderId}&message=${data.message}&resultCode=${data.resultCode}&transId=${data.transId}`;
    const hmac = crypto
      .createHmac('sha256', AppConfig.ZALOPAY_SANDBOX.privateKey as string)
      .update(callbackData)
      .digest('hex');
    return hmac === mac;
  }
}

export default ZaloPayServices;
