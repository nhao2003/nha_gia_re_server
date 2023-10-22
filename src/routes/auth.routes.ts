import { Router } from 'express';
import AuthController from '~/controllers/auth.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';
const router = Router();
router.route('/sign-up').post(AuthValidation.signUpValidation, AuthController.signUp);
router.route('/active-account').get(AuthValidation.acctiveAccountValidation, AuthController.activeAccount);
router.route('/sign-in').post(AuthValidation.signInValidation, AuthController.signIn);
router.route('/refresh-token').get(AuthValidation.refreshTokenValidation, AuthController.refreshToken);
router.route('/change-password').post(AuthValidation.accessTokenValidation, AuthController.changePassword);
router.route('/forgot-password').post(AuthValidation.forgotPasswordValidation, AuthController.forgotPassword);
router
  .route('/verify-forgot-password')
  .get(AuthValidation.verifyRecoveryTokenValidation, AuthController.verifyForgotPassword);
router.route('/sign-out').post(AuthValidation.accessTokenValidation, AuthController.signOut);
router.route('/sign-out-all').post(AuthValidation.accessTokenValidation, AuthController.signOutAll);

export default router;
