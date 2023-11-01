import { Request, Response } from 'express';
import AppResponse from '~/models/AppRespone';
import paymentServices from '~/services/payment.services';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
class PaymentController {
  public readonly createOrderMemberShipPayment = wrapRequestHandler(async (req: Request, res: Response) => {
    const { user_id, membership_id, num_of_subscription_month, discount_code } = req.body;

    if (!user_id || !membership_id || !num_of_subscription_month) {
      res.status(400).json({
        status: 'fail',
        message: 'Missing required fields',
      });
    }

    const result = await paymentServices.subscribePackage({
      user_id,
      package_id: membership_id,
      num_of_subscription_month,
      discount_code,
    });
    const appRessponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Create order successfully',
      result,
    };
    res.status(200).json(appRessponse);
  });
  public readonly verifyZaloPayTransaction = wrapRequestHandler(async (req: Request, res: Response) => {
    const { type, mac, data } = req.body;
    console.log('type', type);
    console.log('mac', mac);
    console.log('data', data);
    const result = await paymentServices.verifySuccessZaloPayTransaction({ type, mac, data });
    console.log('result', result);
    if (result.return_code === 1 || result.return_code === 2) {
      return res.status(200).json(result);
    }
    res.status(500).json({
      return_code: 0,
      return_message: 'exception',
    });
  });
}
export default new PaymentController();
