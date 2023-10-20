import { Router } from 'express';
import userControllers from '~/controllers/user.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';
import { UserValidation } from '~/middlewares/user.middlware';
const router = Router();

router
  .route('/update-profile')
  .patch(AuthValidation.accessTokenValidation, UserValidation.updateProfileValidation, userControllers.updateProfile);
router.route('/profile').get(AuthValidation.accessTokenValidation, userControllers.getUserProfile);
router.route('/:id').get(UserValidation.getUserProfileValidation, userControllers.getUserProfile);
export default router;
