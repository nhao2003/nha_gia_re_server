import { AppDataSource } from './app/database';
// dotenv config
import app from './app/app';
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    //Shut down the server
    process.exit(1);
  });
