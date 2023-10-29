import { Request, Response, Router } from 'express';
import MediaController from '~/controllers/media.controller';
const routes = Router();

routes.post('/upload', MediaController.upload);
export default routes;
