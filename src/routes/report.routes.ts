import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import DependencyInjection from '../di/di';
import AuthValidation from '~/middlewares/auth.middleware';
const router = Router();
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const reportController = DependencyInjection.get<ReportController>(ReportController);
router.route('/').get(reportController.getAllReport);
router.route('/send-report').post(authValidation.accessTokenValidation, reportController.sendReport);

export default router;
