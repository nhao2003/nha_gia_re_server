import path from 'path';
import { DataSource } from 'typeorm';
import AppConfig from '~/constants/configs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: AppConfig.database.host,
  port: Number(AppConfig.database.port),
  username: AppConfig.database.user,
  password: AppConfig.database.password,
  database: AppConfig.database.name,
  ssl: true,
  synchronize: false,
  logging: false,
  entities: [
    AppConfig.isProduction
      ? path.join(__dirname, '..', '..', 'dist', 'domain/databases/entity/*.js')
      : path.join(__dirname, '..', '..', 'src', 'domain/databases/entity/*.ts'),
  ],
  migrations: [],
  subscribers: [],
});

export { AppDataSource };
