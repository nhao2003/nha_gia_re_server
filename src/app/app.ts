import express from 'express';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import postRoutes from '../routes/post.routes';
import blogRoutes from '../routes/blog.routes';
import membershipPackagenRoutes from '../routes/membership_package.routes';
import mediaRoutes from '../routes/media.routes';
import reportRoutes from '../routes/report.routes';
import conversationRoutes from '../routes/conversation.routes';
import notificationRoutes from '../routes/notification.routes';
import { Request, Response } from 'express';
import { User } from '~/domain/databases/entity/User';
import { errorHandler } from '~/middlewares/error.middleware';
import adminRoutes from '../routes/admin.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import AppResponse from '~/models/AppRespone';
import { Express } from 'express';

export function initApp(): Express {
  console.log('Environment:', process.env.NODE_ENV);
  const app = express();
  app.use(cors());
  app.use((req: Request, res: Response, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });
    console.log('/***********************/');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Time:', new Date().toLocaleString());
    console.log('Request Type:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('/***********************/');
    next();
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.static('public'));
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/posts', postRoutes);
  app.use('/api/v1/media', mediaRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/membership-package', membershipPackagenRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/blogs', blogRoutes);
  app.use('/api/v1/conversations', conversationRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.get('/', (req, res) => {
    User.find()
      .then((units) => {
        res.status(200).send(units);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

  app.all('*', (req: Request, res: Response) => {
    const appRes: AppResponse = {
      status: 'fail',
      code: 404,
      message: `Can't find ${req.originalUrl} on this server!`,
    };
    res.status(404).json(appRes);
  });

  app.use(errorHandler);
  return app;
}
