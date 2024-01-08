import { Router } from 'express';
import DependencyInjection from '../di/di';
import AuthValidation from '~/middlewares/auth.middleware';
import { NotificationController } from '~/controllers/notification.controller';
const router = Router();
const authValiation = DependencyInjection.get<AuthValidation>(AuthValidation);
const notificationController = DependencyInjection.get<NotificationController>(NotificationController);

router.get('/', authValiation.accessTokenValidation, notificationController.getNotifications);

export default router;
