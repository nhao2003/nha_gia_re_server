import { Router } from 'express';
import membership_packageController from '~/controllers/membership_package.controller';
import paymentController from '~/controllers/payment.controller';
const routes = Router();

routes.get('/', membership_packageController.getMembershipPackages);
routes.get('/current-subscription', membership_packageController.getCurrentUserMembershipPackage);
routes.get('/user-with-subscription', membership_packageController.getUserWithSubscriptionPackage);
routes.get('/:id', membership_packageController.getMembershipPackageById);
routes.post('/check-out', paymentController.createOrderMemberShipPayment);

// Get current user's membership package
routes.post('/create-mini-app-order', paymentController.createMiniAppOrder);
routes.post('/mini-app-update-payment-status', paymentController.updatePaymentStatus);
routes.post('/mini-app-verify-zalopay-transaction', paymentController.verifyMiniAppTransaction);
routes.route('/verify-zalopay-transaction').post(paymentController.verifyZaloPayTransaction);
export default routes;
