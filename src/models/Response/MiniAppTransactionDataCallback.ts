type MiniAppTransactionDataCallback = {
    appId: string;
    orderId: string;
    transId: string;
    transTime: number;
    merchantTransId: string;
    amount: number;
    description: string;
    resultCode: number;
    message: string;
    extradata: string;
  };

export default MiniAppTransactionDataCallback;