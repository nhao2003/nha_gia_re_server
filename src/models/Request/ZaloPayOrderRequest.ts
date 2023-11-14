  interface ZaloPayOrderRequest {
    app_user: string;
    amount: number;
    item: Record<string, any>[];
    description: string;
    embed_data: Record<string, any>;
    bank_code: string;
    app_trans_id?: string;
    app_time: Date;
    callback_url?: string;
    phone?: string;
    email?: string;
  }
export default ZaloPayOrderRequest;
