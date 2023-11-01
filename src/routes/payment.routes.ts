import { Router } from "express";
import PaymentController from "../controllers/payment.controller";
const routes = Router();

routes.route('/').get(PaymentController.createMemberShipPayment);

export default routes;