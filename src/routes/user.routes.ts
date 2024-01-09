import { Router } from 'express';
import UserControllers from '~/controllers/user.controller';
import AuthValidation from '~/middlewares/auth.middleware';
import { UserValidation } from '~/middlewares/user.middlware';
import DependencyInjection from '../di/di';
const router = Router();

const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const userValidation = DependencyInjection.get<UserValidation>(UserValidation);
const userControllers = DependencyInjection.get<UserControllers>(UserControllers);

router
  .route('/update-profile')
  .patch(authValidation.accessTokenValidation, userValidation.updateProfileValidation, userControllers.updateProfile);
router.route('/profile').get(authValidation.accessTokenValidation, userControllers.getUserProfile);
router.route('/follows').get(authValidation.accessTokenValidation, userControllers.getNumberOfFollowingAndFollowers);
router.route('/follow/:id').post(authValidation.accessTokenValidation, userControllers.followOrUnfollowUser);
router.route('/check-follow/:id').get(authValidation.accessTokenValidation, userControllers.checkFollowUser);
router.route('/:id').get(userValidation.getUserProfileValidation, userControllers.getUserProfile);
export default router;
