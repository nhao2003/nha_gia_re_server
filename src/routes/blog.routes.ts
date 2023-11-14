import { Router } from 'express';
import BlogController from '../controllers/blog.controller';
import { AuthValidation } from '~/middlewares/auth.middleware';
const router = Router();
router.get('/', AuthValidation.getUserByTokenIfExist, BlogController.getAllBlog);
router.get('/:id', AuthValidation.getUserByTokenIfExist, BlogController.getBlogById);
export default router;
