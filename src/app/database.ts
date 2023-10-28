import { DataSource } from 'typeorm';
import AppConfig  from '~/constants/configs';
console.log(AppConfig);
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
  entities: [AppConfig.isProduction ? 'dist/domain/databases/entity/*.js' : 'src/domain/databases/entity/*.ts'],
  migrations: [],
  subscribers: [],
});

export { AppDataSource };
