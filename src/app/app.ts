import express from 'express';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import postRoutes from '../routes/post.routes';
import { Request, Response } from 'express';
import { User } from '~/domain/databases/entity/User';
import { errorHandler } from '~/middlewares/error.middleware';
import { body } from 'express-validator';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.get('/', (req, res) => {
  User.find()
    .then((units) => {
      res.json(units);
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
