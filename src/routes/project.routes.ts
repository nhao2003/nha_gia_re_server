import { Router } from 'express';

import ProjectController from '../controllers/project.controller';
import di from '~/di/di';

const router = Router();

const projectController = di.get<ProjectController>(ProjectController);

router.get('/', projectController.getProjects);

export default router;
