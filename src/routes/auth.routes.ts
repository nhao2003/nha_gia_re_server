import { verify } from 'crypto';
import { Router } from 'express';
import {
  signIn,
  signOut,
  refreshToken,
  changePassword,
  signUp,
  verifyEmail,
  signOutAll,
  forgotPassword as recoveryPassword,
  verifyRecoveryToken as verifyRecoveryCode,
  resetPassword,
} from '~/controllers/auth.controllers';
import AuthController  from '~/controllers/auth.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';
import {
  refreshTokenValidation,
  tokenValidation,
  protect,
} from '~/middlewares/auth.middleware';

const router = Router();

router.route('/sign-up').post(AuthValidation.signUpValidation, AuthController.signUp);
router.route('/active-account').get(AuthValidation.acctiveAccountValidation, AuthController.activeAccount);
router.route('/sign-in').post(AuthValidation.signInValidation, AuthController.signIn);
router.route('/refresh-token').get(refreshTokenValidation, refreshToken);
router.route('/change-password').post(tokenValidation, changePassword);
router.route('/recovery-password').post(recoveryPassword);
router.route('/verify-recovery-code').get(verifyRecoveryCode);
router.route('/reset-password').post(resetPassword);
router.route('/sign-out').post(AuthValidation.checkUserSignedIn, AuthController.signOut);
router.route('/sign-out-all').post(tokenValidation, signOutAll);
router.route('/me').get(tokenValidation, protect);

export default router;
