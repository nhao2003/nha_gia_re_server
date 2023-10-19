import { Router } from 'express';
import userControllers from '~/controllers/user.controllers';
import { AuthValidation } from '~/middlewares/auth.middleware';
import { UserValidation } from '~/middlewares/user.middlware';
const router = Router();

router.route('/update-profile').patch(AuthValidation.accessTokenValidation, UserValidation.updateProfileValidation, userControllers.updateProfile);

export default router;