import { json } from 'express';
import AppConfig from '../constants/configs';
import crypto from 'crypto';
import axios from 'axios';
/**
 * Tạo một đơn hàng thanh toán sử dụng ZaloPay API.
 *
 * @param app_user - Thông tin định danh của người dùng ứng dụng thanh toán đơn hàng, có thể là id/username/tên/số điện thoại/email của người dùng.
 * @param amount - Giá trị của đơn hàng trong đơn vị tiền tệ VND.
 * @param item - Danh sách item của đơn hàng, do ứng dụng tự định nghĩa. Mỗi item bao gồm các trường như 'itemid', 'itemname', 'itemprice', và 'itemquantity'.
 * @param description - Thông tin mô tả về dịch vụ đang được thanh toán, dùng để hiển thị cho người dùng trên ứng dụng ZaloPay và trên công cụ quản lý Merchant.
 * @param embed_data - Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công. Nếu không có, bạn có thể để chuỗi rỗng.
 * @param bank_code - (Tuỳ chọn) Mã ngân hàng, xem cách lấy danh sách các ngân hàng được hỗ trợ. Mặc định là '38'.
 * @param mac - Thông tin chứng thực của đơn hàng, xem cách tạo thông tin chứng thực cho đơn hàng.
 * @param callback_url - ZaloPay sẽ thông báo trạng thái thanh toán của đơn hàng khi thanh toán hoàn tất.
 * @param phone - (Tuỳ chọn) Số điện thoại của người dùng.
 * @param email - (Tuỳ chọn) Địa chỉ email của người dùng.
 *
 * @returns {Promise<void>} - Hàm không trả về giá trị (void).
 */
interface OrderRequest {
  app_user: string;
  amount: number;
  item: string;
  description: string;
  embed_data: string;
  bank_code: string;
  app_trans_id: string;
  app_time: number;
}

interface ZaloPayApiResponse {
  return_code: number; // 1: Thành công, 2: Thất bại
  return_message: string; // Mô tả mã trạng thái
  sub_return_code: number; // Mã trạng thái chi tiết
  sub_return_message: string; // Mô tả chi tiết mã trạng thái
  order_url: string; // Dùng để tạo QR code hoặc gọi chuyển tiếp sang trang cổng ZaloPay
  zp_trans_token: string; // Thông tin token đơn hàng
  order_token: string; // Thông tin token đơn hàng
  qr_code: string; // Dùng để tạo NAPAS VietQR trên hệ thống Merchant
}

class ZaloPayServices {
  private readonly API = 'https://sb-openapi.zalopay.vn/v2/create';
  public generateTransactionId(date: Date): string {
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
  createOrderMac(order: OrderRequest) {
     const data = AppConfig.ZALOPAY_SANDBOX.app_id +"|"+ order.app_trans_id +"|"+ order.app_user
      +"|"+ order.amount +"|"+ order.app_time +"|"+ order.embed_data
      +"|"+ order.item;
      const hmac = crypto.createHmac('sha256', AppConfig.ZALOPAY_SANDBOX.key1 as string).update(data).digest('hex');
      return hmac;
  }

  async createOrder(): Promise<ZaloPayApiResponse> {
    const embed_data = {};
    const items = [{}];
    const transID = this.generateTransactionId(new Date());
    const orderRequest: OrderRequest = {
      app_trans_id: transID, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order`,
      bank_code: 'zalopayapp',
    };
   const body = {
    ...orderRequest,
    appid: AppConfig.ZALOPAY_SANDBOX.app_id,
    mac: this.createOrderMac(orderRequest),
   }

   console.log(body);
    
    const response = await fetch(this.API, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }
}

//Test

const zaloPayServices = new ZaloPayServices();

async function test() {
  const date = new Date();
  const data = await zaloPayServices.createOrder();
  console.log(data);
}

test()
  .then((data) => {
    console.log(data);
    console.log('Done');
  })
  .catch((err) => {
    console.log(err);
  });
