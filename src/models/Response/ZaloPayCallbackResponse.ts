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

export default ZaloPayCallbackResponse;
