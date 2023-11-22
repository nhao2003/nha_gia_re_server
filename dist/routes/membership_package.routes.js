"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const membership_package_controller_1 = __importDefault(require("../controllers/membership_package.controller"));
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const di_1 = __importDefault(require("../di/di"));
const routes = (0, express_1.Router)();
const membership_packageController = di_1.default.get(membership_package_controller_1.default);
const paymentController = di_1.default.get(payment_controller_1.default);
routes.get('/', membership_packageController.getMembershipPackages);
routes.get('/current-subscription', membership_packageController.getCurrentUserMembershipPackage);
routes.get('/user-with-subscription', membership_packageController.getUserWithSubscriptionPackage);
routes.get('/transactions', paymentController.getTransaction);
routes.post('/check-out', paymentController.createOrderMemberShipPayment);
// Get current user's membership package
routes.post('/create-mini-app-order', paymentController.createMiniAppOrder);
routes.post('/mini-app-update-payment-status', paymentController.updatePaymentStatus);
routes.post('/verify-mini-app-zalopay-transaction', paymentController.verifyMiniAppTransaction);
routes.route('/verify-zalopay-transaction').post(paymentController.verifyZaloPayTransaction);
routes.get('/:id', membership_packageController.getMembershipPackageById);
exports.default = routes;
