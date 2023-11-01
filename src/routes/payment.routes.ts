import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
const routes = Router();

routes.route('/create-membership-package-order').post(PaymentController.createOrderMemberShipPayment);
routes.route('/verify-zalopay-transaction').post(PaymentController.verifyZaloPayTransaction);

export default routes;