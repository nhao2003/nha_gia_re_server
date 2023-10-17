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
import {
  signInValidation,
  refreshTokenValidation,
  tokenValidation,
  protect,
  signUpValidation,
} from '~/middlewares/auth.middleware';

const router = Router();

router.route('/sign-up').post(signUpValidation, AuthController.signUp);
router.route('/verify-email').get(verifyEmail);
router.route('/sign-in').post(signInValidation, AuthController.signIn);
router.route('/refresh-token').get(refreshTokenValidation, refreshToken);
router.route('/change-password').post(tokenValidation, changePassword);
router.route('/recovery-password').post(recoveryPassword);
router.route('/verify-recovery-code').get(verifyRecoveryCode);
router.route('/reset-password').post(resetPassword);
router.route('/sign-out').post(refreshTokenValidation, signOut);
router.route('/sign-out-all').post(tokenValidation, signOutAll);
router.route('/me').get(tokenValidation, protect);

export default router;
