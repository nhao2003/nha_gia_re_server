type ZaloPayOrderResponse = {
  return_code: number; // 1: Thành công, 2: Thất bại
  return_message: string; // Mô tả mã trạng thái
  sub_return_code: number; // Mã trạng thái chi tiết
  sub_return_message: string; // Mô tả chi tiết mã trạng thái
  order_url: string; // Dùng để tạo QR code hoặc gọi chuyển tiếp sang trang cổng ZaloPay
  zp_trans_token: string; // Thông tin token đơn hàng
  order_token: string; // Thông tin token đơn hàng
  qr_code: string; // Dùng để tạo NAPAS VietQR trên hệ thống Merchant
  app_trans_id: string; // Mã giao dịch của hệ thống Merchant
}

export default ZaloPayOrderResponse;
