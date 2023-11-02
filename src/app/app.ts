import express from 'express';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import postRoutes from '../routes/post.routes';
import membershipPackagenRoutes from '../routes/membership_package.routes';
import mediaRoutes from '../routes/media.routes';
import { Request, Response } from 'express';
import { User } from '~/domain/databases/entity/User';
import { errorHandler } from '~/middlewares/error.middleware';
import adminRoutes from '../routes/admin.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
// Add cors
// https://h5.zdn.vn
// zbrowser://h5.zdn.vn

app.use(cors());
app.use((req, res, next) => {
  res.header({ 'Access-Control-Allow-Origin': '*' });
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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

export default app;
