import { Router } from 'express';
import Membership_packageController from '~/controllers/membership_package.controller';
import PaymentController from '~/controllers/payment.controller';
import DependencyInjection from '../di/di';
import AuthValidation from '~/middlewares/auth.middleware';
const routes = Router();

const membership_packageController =
  DependencyInjection.get<Membership_packageController>(Membership_packageController);
const paymentController = DependencyInjection.get<PaymentController>(PaymentController);
const authValiation = DependencyInjection.get<AuthValidation>(AuthValidation);
routes.get('/', membership_packageController.getMembershipPackages);
routes.get(
  '/current-subscription',
  authValiation.accessTokenValidation,
  membership_packageController.getCurrentUserMembershipPackage,
);
routes.get('/user-with-subscription', membership_packageController.getUserWithSubscriptionPackage);
routes.get('/transactions', authValiation.accessTokenValidation, paymentController.getTransactions);
// unsubscription
routes.post('/unsubscribe', authValiation.accessTokenValidation, membership_packageController.unsubscribe);
routes.post('/check-out', paymentController.createOrderMemberShipPayment);
routes.get('/discounts', membership_packageController.getDiscounts);
// Get current user's membership package
routes.post('/create-mini-app-order', paymentController.createMiniAppOrder);
routes.post('/mini-app-update-payment-status', paymentController.updatePaymentStatus);
routes.post('/verify-mini-app-zalopay-transaction', paymentController.verifyMiniAppTransaction);
routes.route('/verify-zalopay-transaction').post(paymentController.verifyZaloPayTransaction);

routes.get('/:id', membership_packageController.getMembershipPackageById);
export default routes;
