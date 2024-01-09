import { Router } from 'express';
import AuthValidation from '~/middlewares/auth.middleware';
import DependencyInjection from '../di/di';
import AccountVerificationRequestController from '~/controllers/account_verification_request.controller';
const router = Router();

const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const accountVerificationRequestControllers = DependencyInjection.get<AccountVerificationRequestController>(
  AccountVerificationRequestController,
);

router.route('/').post(authValidation.accessTokenValidation, accountVerificationRequestControllers.sendRequest);

export default router;
