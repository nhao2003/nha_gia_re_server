import { Router } from 'express';
import DeveloperController from '~/controllers/developer.controller';

const router = Router();
router.route('/').get(DeveloperController.getDevelopers);
router.route(':id');
export default router;
